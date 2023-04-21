import { Body, Controller, Delete, Get, Headers, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards, UsePipes, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/entities/User.entity';
import { CreateStoreDto, CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { PostDataDto } from './dto/PostData.dto';
import { VerifyEmailDto } from './dto/VerifyEmail.dto';
import { UpdateMyUserDto } from './dto/UpdateMyUser.dto';
import { User } from './decorators/user.decorator';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { FindUsersDto } from './dto/FindUsers.dto';
import { FirebaseAuthDto } from './dto/firebase-auth.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { LoginDto } from './dto/login.dto';
import { QueryLogoutDto } from './dto/query-logout.dto';
import { BusinessType } from 'src/config';
import { Request, Response } from 'express';
import { toAbsoluteUrl } from 'src/shared/utils/util';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.userService.login(body);
  }

  @Post('fblogin')
  fbLogin(@Body() body: FirebaseAuthDto, @Headers('authorization') idToken: string,) {
    return this.userService.socialLogin(body, { idToken, isFacebook: true });
  }

  @Post('gglogin')
  gglogin(@Body() body: FirebaseAuthDto, @Headers('authorization') idToken: string,) {
    return this.userService.socialLogin(body, { idToken, isGoogle: true });
  }

  @Post('applelogin')
  applelogin(@Body() body: FirebaseAuthDto, @Headers('authorization') idToken: string,) {
    return this.userService.socialLogin(body, { idToken, isApple: true });
  }

  @Get('logout')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  logout(@Query() { refreshToken, deviceToken }: QueryLogoutDto, @User('userId') userId: number) {
    return this.userService.logout(refreshToken, userId, deviceToken);
  }

  @Post('refreshToken')
  @UsePipes(new ValidationPipe())
  refreshToken(@Body() _postData: PostDataDto) {
    return this.userService.refreshToken(_postData);
  }

  @Get('user/:UserId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async getUserByID(@Param('UserId') UserId: number) {
    return this.userService.getUserByID(UserId);
  }

  @Get('/findUsers')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  async findUsers(@Query() _findUsers: FindUsersDto, @User('companyId') companyId: number,) {
    return this.userService.findUsers(_findUsers, companyId);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async myUser(@User('userId') userId: number) {
    return this.userService.myUser(userId);
  }

  @Get('forgot')
  async forgotPassword(@Query('email') email: string): Promise<{ status: Boolean }> {
    return this.userService.forgotPassword(email);
  }

  @Get('checkUsername')
  async checkUsername(@Param('email') email: string) {
    return this.userService.checkUsername(email);
  }

  @Get('code-again')
  async sendVerifyEmailAgain(@Param('email') email: string) {
    return this.userService.sendVerifyEmailAgain(email);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() _user: CreateUserDto) {
    return this.userService.createUser(_user);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async createAccount(@Body() _user: CreateAccountDto) {
    return await this.userService.createAccount(_user);
  }

  @Post('verify')
  @UsePipes(new ValidationPipe())
  async verifyEmail(@Body() { code, email }: VerifyEmailDto) {
    return await this.userService.verifyEmail(code, email);
  }

  @Put('me')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async updateMyUser(@Body() profile: UpdateMyUserDto) {
    return this.userService.updateMyUser(profile);
  }

  @Put('update')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Body() user: UserEntity, @User('companyId') companyId: number,) {
    return this.userService.updateUser(user, companyId);
  }

  @Delete(':userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.deleteUser(userId);
  }

  @Put('/update-company/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthenticationGuard)
  updateCompany(@Param('id', ParseIntPipe) id: number, @Body() body: CreateStoreDto) {
    return this.userService.updateCompany(id, body);
  }

  @Get("/suggest-business-type")
  getSuggessBusinessType() {
    return BusinessType
  }

  @Post('/facebook/deletion')
  parseSignedRequest(@Req() request: Request, @Res() response: Response) {
    const confirmationCode = this.userService.getConfirmationCode();
    const path = `/facebook/deletion-status?code=${confirmationCode}`;
    const url = toAbsoluteUrl(request, path)
    response.type('json');
    return response.send(`{ url: '${url}'}, confirmation_code: '${confirmationCode}'`);
  }

  @Get('/facebook/deletion-status')
  deletionStatus(@Res() response: Response, @Query('code') code: number) {
    return response.status(HttpStatus.OK).json({ code });
  }
}
