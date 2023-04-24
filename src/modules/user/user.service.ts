import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { LIFE_SECRET, REFRESH_TOKEN_LIFE_EXPIRES, REFRESH_TOKEN_SECRET, SECRET, TOKEN_LIFE_EXPIRES, } from 'src/config';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { UserEntity } from 'src/entities/User.entity';
import { DataStoredInToken } from 'src/shared/interfaces/DataStoreInToken.interface';
import { TokenData } from 'src/shared/interfaces/TokenData.interface';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from './dto/createUser.dto';
import * as jwt from 'jsonwebtoken';
import { RedisCacheService } from '../cache/redisCache.service';
import { PostDataDto } from './dto/PostData.dto';
import { UserGateway } from './user.gateway';
import { validate } from 'class-validator';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import crypto = require('crypto');
import { getAuth } from 'firebase-admin/auth';
import { UserTokenDTO } from './dto/user-token.dto';
import { LoginDto } from './dto/login.dto';
import { NotifyService } from '../notify/notify.service';
import { SettingEntity } from 'src/entities/Setting.entity';
import { CreateStoreDto } from '../store/dto/create-store.dto';

@Injectable()
export class UserService {
  constructor(
    private emailService: EmailService,
    private cache: RedisCacheService,
    @Inject(forwardRef(() => UserGateway))
    private userGateway: UserGateway,
    private readonly notifyService: NotifyService
  ) { }


  async signup(_user: CreateUserDto) {
    const { email, password, store, fullName, phoneNumber } = _user;

    const findUser = await UserEntity.findOne({ where: { email } });
    if (findUser) {
      throw new HttpException('User already existed!!', HttpStatus.CONFLICT);
    }

    let user = UserEntity.create(<UserEntity>{
      fullName, email, password, phoneNumber
    });
    user.hashPassword();

    user = await user.save();

    let newStore = StoreEntity.create(<StoreEntity>{
      name: store.name,
      categories: store.categories,
      phoneNumber: store.phoneNumber,
      email: email,
      address: store.address,
      city: store.city,
      zipcode: store.zipcode,
      image: store.image,
      timezone: store.timezone,
      bookingSlotSize: store.bookingSlotSize,
      notes: store.notes,
      cancelTime: store.cancelTime,
      user
    })

    newStore = await newStore.save();

    let openHours = [];
    for (let i = 0; i < 7; i++) {
      openHours.push(<OpenHourEntity>{
        day: i,
        open: true,
        store: newStore
      })
    }
    OpenHourEntity.save(openHours);

    // create AppointmentSetting
    const appSetting = new SettingEntity();
    appSetting.store = newStore;
    SettingEntity.save(<SettingEntity>appSetting);
    return this.createToken(user, newStore.id);
  }

  async signin(body: LoginDto) {
    const { email, password } = body;
    let user = await UserEntity.createQueryBuilder('user')
      .leftJoinAndSelect('user.store', 'store')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()


    if (!user) throw new HttpException('Account suppended', HttpStatus.SERVICE_UNAVAILABLE,);

    if (!user.isActive) throw new HttpException("Account does not exist!", HttpStatus.BAD_REQUEST)

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new HttpException('Wrong credentials provided', HttpStatus.FORBIDDEN,);
    }

    const tokenData = await this.createToken(user);
    this.cache.set(tokenData.refreshToken, tokenData.token);

    if (body?.deviceToken) {
      let topic = body.email.replace(/[^\w\s]/gi, '')
      let result = await this.notifyService.subscribeNotiTopic(topic, body.deviceToken)
      if (result.successCount == 1) {
        UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email }).execute()
      }
    }

    return tokenData;
  }

  async logout(refreshToken: string, userId: number, deviceToken?: string) {
    if (refreshToken) this.cache.delete(refreshToken);
    const user = await this.findOneUser(userId);
    let topic = user.email.replace(/[^\w\s]/gi, '')
    this.notifyService.unSubscriptionNotiTopic(topic, deviceToken);
    return { success: true };
  }

  async createToken(user: UserEntity, storeId?: number) {
    let store = await StoreEntity.createQueryBuilder('store').where("store.userId = :id", { id: user.id }).getOne();
    let _storeId = storeId ? storeId : store.id;

    const dataStoredInToken: DataStoredInToken = { userId: user.id, storeId: _storeId, };

    const response: TokenData = {
      expiresIn: TOKEN_LIFE_EXPIRES,
      token: jwt.sign(dataStoredInToken, LIFE_SECRET, { expiresIn: TOKEN_LIFE_EXPIRES, }),
      refreshToken: jwt.sign(dataStoredInToken, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_EXPIRES, }),
    };

    return response;
  }


  async refreshToken(_postData: PostDataDto) {
    const token = await this.cache.get(_postData.refreshToken);

    if (!token) throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);

    if (_postData.token !== token) throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);

    try {
      const decoded = jwt.verify(_postData.refreshToken, REFRESH_TOKEN_SECRET,) as DataStoredInToken;

      const tokenData = { userId: decoded.userId, storeId: decoded.storeId };

      const newToken = jwt.sign(tokenData, LIFE_SECRET, { expiresIn: TOKEN_LIFE_EXPIRES, });
      const newRefreshToken = jwt.sign(tokenData, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_EXPIRES, });

      this.cache.delete(_postData.refreshToken);
      this.cache.set(newRefreshToken, newToken);
      const response = { expiresIn: TOKEN_LIFE_EXPIRES, token: newToken, refreshToken: newRefreshToken, };
      return response;
    } catch (error) {
      throw new HttpException('Wrong authentication token', HttpStatus.UNAUTHORIZED);
    }
  }

  async findOneUser(id: number): Promise<UserEntity> {
    let user = await UserEntity.createQueryBuilder('user').where("user.id = :id", { id }).getOne();
    if (!user || !user.isActive) throw new NotFoundException("Not found user!");
    return user;
  }

  deleteUser(userId: number) {
    UserEntity.createQueryBuilder().update({ isActive: false }).where("id = :userId", { userId }).execute();
    return { message: 'delete' };
  }


  async updateUser(bodyUpdateUser: CreateUserDto, userId: number) {
    let user = await this.findOneUser(userId);
    let userUpdate = {
      ...user,
      id: userId,
      fullName: bodyUpdateUser.fullName,
      email: bodyUpdateUser.email,
      password: bodyUpdateUser.password,
      image: bodyUpdateUser.image,
      topicNoti: bodyUpdateUser.topicNoti,
      phoneNumber: bodyUpdateUser.phoneNumber,
    }
    return UserEntity.save(<UserEntity>userUpdate);
  }

  async socialLogin(body: FirebaseAuthDto, type: { idToken: string; isFacebook?: boolean; isGoogle?: boolean; isApple?: boolean }) {
    const bodyEmail = body.email ?? body.providerData[0].email;
    if (!bodyEmail) {
      throw new BadRequestException('No data ');
    }
    const _user = await this.findOne(bodyEmail);

    //Signup
    if (!_user) {
      const idToken = type.idToken.replace('Bearer ', '');
      const decodedToken = await getAuth().verifyIdToken(idToken);
      return this.createSocialLogin(
        {
          email: bodyEmail,
          password: body.uid,
          name: body.displayName,
          deviceToken: body.deviceToken,
          store: body.store
        },
        {
          isFacebook: type.isFacebook ?? false,
          isGoogle: type.isGoogle ?? false,
          isApple: type.isApple ?? false,
          isEmailVerify: body.emailVerified ?? false,
          image: body.photoURL,
          decodedToken: decodedToken.uid,
        },
      );
    }
    const errors = { User: ' not found' };
    if (type.idToken) {
      const idToken = type.idToken.replace('Bearer ', '');
      const decodedToken = await getAuth().verifyIdToken(idToken);

      if (body.uid === decodedToken.uid) {
        if (!_user.isActive) UserEntity.update(_user.id, { isActive: true });

        const store = await StoreEntity.findOne({ where: { userId: _user.id } })

        return this.buildUserRO(_user.email, store.id);
      }
    }
    //deprecated
    if (body.uid === _user.googleId || body.uid === _user.facebookId || body.uid === _user.appleId) {
      const token = this.generateJWT(_user);
      const { email, fullName, image } = _user;
      const user: UserTokenDTO = { email, token, name: fullName, image };

      if (!_user.isActive) UserEntity.update(_user.id, { isActive: true });

      if (body?.deviceToken) {
        let topic = body.email.replace(/[^\w\s]/gi, '')
        let result = await this.notifyService.subscribeNotiTopic(topic, body.deviceToken)
        if (result.successCount == 1) {
          UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email: _user.email }).execute()
        }
      }

      return user;
    }
    throw new HttpException({ errors }, 401);
  }

  findOne(email: string): Promise<UserEntity> {
    return UserEntity.createQueryBuilder('user')
      .select(['user.fullName', 'user.id', 'user.image', 'user.email', 'user.isActive',])
      .leftJoinAndSelect('user.store', 'store')
      .where('user.email = :email', { email })
      .getOne();
  }

  async createSocialLogin(dto: CreateUserDTO, socialSignup?: {
    isFacebook?: boolean; isGoogle?: boolean;
    isApple?: boolean; isEmailVerify?: boolean;
    image?: string; decodedToken?: string;
  }) {
    // check uniqueness of phone/email
    const { email } = dto;
    const qb = UserEntity.createQueryBuilder('user').where('user.email = :email', { email });

    const user = await qb.getOne();
    if (user) {
      const errors = { username: 'Email must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST,);
    }

    const newUser = new UserEntity();
    newUser.fullName = dto.name ?? 'User';
    newUser.email = email;
    newUser.password = this.hashPassword(dto.password);


    if (socialSignup) {
      newUser.facebookId = socialSignup.isFacebook ? socialSignup.decodedToken : undefined;
      newUser.googleId = socialSignup.isGoogle ? socialSignup.decodedToken : undefined;
      newUser.appleId = socialSignup.isApple ? socialSignup.decodedToken : undefined;
      newUser.image = socialSignup.image;
    }
    const errors = await validate(newUser);

    if (errors.length > 0) {
      const _errors = { username: 'User input is not valid.' };
      throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST,);
    } else {
      UserEntity.save(newUser);

      if (dto?.deviceToken) {
        let topic = dto.email.replace(/[^\w\s]/gi, '')
        let result = await this.notifyService.subscribeNotiTopic(topic, dto.deviceToken)
        if (result.successCount == 1) {
          UserEntity.createQueryBuilder().update({ topicNoti: topic }).where("email = :email", { email }).execute()
        }
      }

      // return this.buildUserRO(savedUser.email, store.id)
    }
  }

  async createStore(userId: number, body: CreateStoreDto) {
    let user = await UserEntity.findOne({ where: { id: userId } });
    return StoreEntity.save(<StoreEntity>{ name: body ? body.name ? body.name : 'string' : 'string', user });
  }

  private async buildUserRO(email: string, storeId?: number) {
    const _user = await this.findOne(email)
    const token = await this.createToken(_user, storeId)

    const userRO = {
      ..._user,
      id: _user.id,
      name: _user.fullName,
      email: _user.email,
      image: _user.image,
      zipcodeRequest: true,
    };

    const resonpose = {
      userInfo: userRO,
      accessToken: token
    }

    return resonpose;
  }

  hashPassword(password: string) {
    const salt = crypto.randomBytes(32).toString('hex');
    const password_hash = crypto.createHash('sha256').update(salt + password).digest('hex');
    password = salt + password_hash;
    return password;
  }

  public generateJWT(user: UserEntity) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({ id: user.id, name: user.fullName }, SECRET, {});
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string, encryptedPassword: string,) {
    const salt = encryptedPassword.substring(0, 64);
    const hash = encryptedPassword.substring(64);
    const password_hash = crypto.createHash('sha256').update(salt + unencryptedPassword).digest('hex');
    return hash === password_hash;
  }


  getConfirmationCode() {
    return crypto.randomBytes(10).toString('hex')
  }
}
