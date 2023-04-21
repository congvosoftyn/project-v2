import { Injectable } from '@nestjs/common';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { PictureEntity } from 'src/entities/Picture.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { ReviewEntity } from 'src/entities/Review.entity';
import { SiteModuleEntity } from 'src/entities/SiteModule.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { DataStoredInToken } from 'src/shared/interfaces/DataStoreInToken.interface';
import { TokenData } from 'src/shared/interfaces/TokenData.interface';
import { RedisCacheService } from '../cache/redisCache.service';
import { GetCustomerStoresDto } from './dto/GetCustomerStores.dto';
import * as jwt from 'jsonwebtoken';
import { LIFE_SECRET, REFRESH_TOKEN_LIFE_EXPIRES, REFRESH_TOKEN_SECRET, TOKEN_LIFE_EXPIRES } from 'src/config';
import { EditStoreDto } from './dto/EditStore.dto';
import { UploadImageDto } from './dto/UploadImage.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AppointmentSettingEntity } from 'src/entities/Setting.entity';

@Injectable()
export class StoreService {
    constructor(private cacheService: RedisCacheService,) { }

    async checkAvailability(subDomain: string) {
        const count = await StoreEntity.count({ where: { subDomain } });
        return { available: count == 0 };
    }

    async getStores(companyId: number) {
        return await StoreEntity.find({ where: { companyId }, relations: ['openHours', 'pictures'] });
    }

    async updateStore(id: number, store: UpdateStoreDto) {
        const { openHours, appointmentSetting } = store;
        try {
            for (const openHour of openHours) {
                OpenHourEntity.createQueryBuilder()
                    .update({ open: openHour.open, day: openHour.day, fromHour: openHour.fromHour, toHour: openHour.toHour })
                    .where('id = :id and storeId = :storeId', { id: openHour.id, storeId: id })
                    .execute()
            }
            AppointmentSettingEntity.update(appointmentSetting.id, appointmentSetting)

            store.openHours = undefined;
            delete store.pictures;
            delete store.appointmentSetting;
            await StoreEntity.update(id, store as unknown as StoreEntity)
            return await StoreEntity.findOne({ where: { id: id }, relations: ['openHours', 'appointmentSetting'] });
        } catch (error) {
            console.log("error", error, store)
        }
    }

    async getStore(id: number, _storeId?: number) {
        const storeId = id || _storeId;
        const store = await StoreEntity.findOne({ where: { id: storeId }, relations: ['openHours', 'appointmentSetting'] });
        // if (!store.subDomain) {
        //     let storeDomainName = store.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
        //     const similarStoreNames = await StoreEntity.createQueryBuilder("store")
        //         .where("store.subDomain LIKE :storeDomainName", { storeDomainName: `${storeDomainName}%` })
        //         .getCount();

        //     if (similarStoreNames > 0) storeDomainName = storeDomainName + similarStoreNames;

        //     store.subDomain = storeDomainName;
        //     await StoreEntity.save(store);
        // }
        if (store && store.openHours.length == 0) {
            for (let i = 0; i < 7; i++) {
                const openHour = <OpenHourEntity>{
                    day: i,
                    open: true,
                    storeId: store.id,
                };
                await OpenHourEntity.save(openHour);
                store.openHours.push(openHour);
            }
        }
        return store
    }

    async getModules(companyId: number) {
        return await SiteModuleEntity.createQueryBuilder('module')
            .leftJoin('module.packages', 'package')
            .leftJoin('package.subscription', 'subscription')
            .where('subscription.companyId = :companyId', { companyId })
            .getMany();
    }


    async getcustomerStores(_data: GetCustomerStoresDto) {
        //   const customerId = res.locals.jwtPayload.customerId;
        const latitude = _data.latitude;
        const longitude = _data.longitude;
        const myLatitude = _data.myLatitude || _data.latitude;
        const myLongitude = _data.myLongitude || _data.longitude;
        const search = _data.search;
        const hasService = _data.hasService;
        const zoom = _data.zoom || 500;
        const skip = _data.skip || 0;
        const take = _data.take || 10

        let builder = StoreEntity.createQueryBuilder('store')
            .addSelect(`ROUND( 6353 * 2 * 
                ASIN(SQRT( POWER(SIN((${myLatitude} - abs(store.latitude)) * pi()/180 / 2),2) 
                + COS(${myLatitude} * pi()/180 ) * COS( abs(store.latitude) *  pi()/180) 
                * POWER(SIN((${myLongitude} - store.longitude) * pi()/180 / 2), 2) ))
                , 2)`, 'store_distance')
            .addSelect(`exists (${ProductEntity.createQueryBuilder('service').select(['service.storeId', 'service.isService']).where('service.storeId = store.id').andWhere('service.isService=true').getQuery()})`, 'store_hasService')
            .addSelect(s => s.select('ROUND(AVG(review.rate),1)', 'store_rate').from('review', 'review').where('review.storeId=store.id'), 'store_rate')
            .leftJoinAndSelect('store.pictures', 'pictures')
            .leftJoinAndSelect('store.tags', 'tags')
            .leftJoinAndSelect('store.rewards', 'rewards', 'rewards.isActive=true')
            .leftJoinAndSelect('store.promotions', 'promotions')
            .leftJoinAndSelect('store.openHours', 'openHours')
            .leftJoinAndSelect('store.reviews', 'reviews')
            .where({ isActive: true })
            .having(`ROUND( 6353 * 2 * 
                ASIN(SQRT( POWER(SIN((${latitude} - abs(store.latitude)) * pi()/180 / 2),2) 
                + COS(${latitude} * pi()/180 ) * COS( abs(store.latitude) *  pi()/180) 
                * POWER(SIN((${longitude} - store.longitude) * pi()/180 / 2), 2) ))
                , 2) < ${zoom}`)
            .orderBy('store_distance')
            .take(+take)
            .skip(+skip);

        if (search) {
            builder = builder.andWhere(`LOWER(store.address) LIKE LOWER('%${search}%') OR LOWER(store.name) LIKE LOWER('%${search}%') OR LOWER(tags.name) LIKE LOWER('%${search}%') COLLATE utf8_bin OR LOWER(store.categories) LIKE LOWER('%${search}%')`);
        }

        if (hasService == 'true') {
            builder = builder.andHaving('`store_hasService` = true')
        }
        return await builder.getMany();
    }

    async getCustomerStoreDetail(storeId: number) {
        return await StoreEntity.createQueryBuilder('store')
            .addSelect(s => s
                .select('ROUND(AVG(review.rate),1)', 'store_rate')
                .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_rate')
            .addSelect(s => s
                .select('COUNT(review.id)', 'review_count')
                .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_reviewCount')
            .addSelect(`exists (${ProductEntity.createQueryBuilder('service').where('service.storeId = store.id').andWhere('service.isService=true').getQuery()})`, 'store_hasService')
            .leftJoinAndSelect('store.tags', 'tags')
            .leftJoinAndSelect('store.pictures', 'pictures')
            .leftJoinAndSelect('pictures.customer', 'customer')
            .leftJoinAndSelect('store.rewards', 'rewards', 'rewards.isActive=true')
            .leftJoinAndSelect('store.promotions', 'promotions')
            .leftJoinAndSelect('store.openHours', 'openHours')
            .where({ isActive: true, id: storeId })
            .getOne();
    }

    async getWallet(customerId: number, skip: number, take: number) {
        return await StoreEntity.createQueryBuilder('store')
            .leftJoinAndSelect('store.company', 'company')
            .leftJoinAndSelect('company.companyCustomer', 'companyCustomer')
            .leftJoinAndSelect('store.rewards', 'rewards')
            .take(+take || 10)
            .skip(+skip || 0)
            .orderBy('companyCustomer.totalPoint', 'DESC')
            .where('companyCustomer.customerId = :customerId', { customerId })
            .getMany();
    }

    async uploadImage(body: UploadImageDto, customerId: number, storeId: number) {
        const pictures = body.pictures;
        const store = await StoreEntity.findOne({ where: { id: storeId }, relations: ['pictures'] });
        for (const element of pictures) {
            let picture = new PictureEntity();
            picture.picture = element.image;
            picture.customerId = customerId;
            picture.thumbnail = element.thumb;
            await picture.save();
            store.pictures.push(picture);

        }
        await StoreEntity.save(store);
        return { message: 'Upload succeeded' }
    }


    async selectStore(storeId: number, refreshToken: string, companyId: number, roleIds: [number], userId: number) {
        this.cacheService.delete(refreshToken);
        const tokenData = await this.createToken({ companyId, roleIds, storeId, userId });
        this.cacheService.set(tokenData.refreshToken, tokenData.token);
        const response = { accessToken: tokenData };
        return response;
    }

    async editStore(body: EditStoreDto, companyId: number) {
        const store = body as StoreEntity;
        store.companyId = companyId;


        if (store.pictures && store.pictures.some(p => (!p.id))) {
            for (let element of store.pictures.filter(p => (!p.id))) {
                let picture = new PictureEntity();
                picture.picture = element.picture;
                picture.thumbnail = element.thumbnail;
                element = await picture.save();
                //   store.pictures.push(picture);
            }
        }

        //init default store appointment setting
        const appSetting = new AppointmentSettingEntity();
        store.appointmentSetting = appSetting;

        await StoreEntity.save(store);
        if (store.openHours) {
            for (let openHour of store.openHours) {
                await OpenHourEntity.save(openHour);
            }
        }
        return store
    }

    async getStoreCategories() {
        return await StoreEntity.createQueryBuilder('store')
            .select("categories")
            .distinct(true)
            .where("store.categories IS NOT NULL ")
            .where("LENGTH(store.categories)  > 0")
            .limit(10)
            .getRawMany();
    }

    async createToken(payload: DataStoredInToken): Promise<TokenData> {
        const dataStoredInToken: DataStoredInToken = {
            userId: payload.userId,
            companyId: payload.companyId,
            storeId: payload.storeId,
            roleIds: payload.roleIds
        };

        return {
            expiresIn: TOKEN_LIFE_EXPIRES,
            token: jwt.sign(dataStoredInToken, LIFE_SECRET, { expiresIn: TOKEN_LIFE_EXPIRES }),
            refreshToken: jwt.sign(dataStoredInToken, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE_EXPIRES }),
        };
    }

    async getCheckin(customerId: number) {
        return await CheckInEntity.createQueryBuilder('checkin')
            .leftJoinAndSelect('checkin.store', 'store')
            // .leftJoinAndSelect('store.pictures', 'pictures')
            // .leftJoinAndSelect('store.tags', 'tags')
            // .leftJoinAndSelect('store.rewards', 'rewards', 'rewards.isActive=true')
            // .leftJoinAndSelect('store.promotions', 'promotions')
            // .leftJoinAndSelect('store.openHours', 'openHours')
            // .leftJoinAndSelect('store.reviews', 'reviews')
            .leftJoinAndSelect('checkin.companyCustomer', 'companyCustomer')
            .where('companyCustomer.customerId = :customerId', { customerId })
            .orderBy('checkin.checkInDate', 'DESC')
            .getMany();
    }

    async getReview(skip: number, take: number, storeId: number) {
        return await ReviewEntity.createQueryBuilder('review')
            .leftJoinAndSelect('review.store', 'store')
            .leftJoinAndSelect('review.customer', 'customer')
            .where('review.storeId = :storeId', { storeId })
            .orderBy('review.created', 'DESC')
            .limit(take || 10)
            .offset(skip || 0)
            .getMany();
    }

    async getRating(storeId: number) {
        const review_rate = await ReviewEntity.createQueryBuilder('review')
            .select('ROUND(AVG(review.rate),1)', 'rating_avg')
            .addSelect('COUNT(review.id)', 'rating_count')
            .leftJoin('review.store', 'store')
            .where('review.storeId = :storeId', { storeId })
            .orderBy('review.created', 'DESC')
            .getRawOne();
        const review_meta = await ReviewEntity.createQueryBuilder('review')
            .select('review.rate', 'rate')
            .addSelect('COUNT(*)', 'count')
            .groupBy('review.rate')
            .leftJoin('review.store', 'store')
            .orderBy('rate', 'ASC')
            .where('review.storeId = :storeId', { storeId })
            .getRawMany();

        review_rate.review_meta = review_meta.reduce((acc, curr) => (acc[curr.rate] = curr.count, acc), {})
        return review_rate;
    }

    async getWalletDetail(id: number) {
        return await StoreEntity.createQueryBuilder('store')
            .leftJoinAndSelect('store.rewards', 'rewards', 'rewards.isActive=true')
            .leftJoinAndSelect('store.promotions', 'promotions')
            .where('store.id = :id', { id })
            .getOne();
    }
}
