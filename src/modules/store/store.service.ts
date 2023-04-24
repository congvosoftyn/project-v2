import { Injectable, NotFoundException } from '@nestjs/common';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { RedisCacheService } from '../cache/redisCache.service';
import { UserEntity } from 'src/entities/User.entity';
import { SettingEntity } from 'src/entities/Setting.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
    constructor(private cacheService: RedisCacheService,) { }

    getStores(userId: number) {
        return StoreEntity.find({ where: { userId }, relations: ['openHours'] });
    }

    async getStore(id: number) {
        const store = await StoreEntity.findOne({ where: { id }, relations: ['openHours', 'setting'] });
        if(!store) throw new NotFoundException("Not found store!");

        if (store && store.openHours.length == 0) {
            let openHours = [];
            for (let i = 0; i < 7; i++) {
                openHours.push(<OpenHourEntity>{
                    day: i,
                    open: true,
                    store
                })

            }
            OpenHourEntity.save(openHours);
        }
        return store
    }

    // async getcustomerStores(_data: GetCustomerStoresDto) {
    //     //   const customerId = res.locals.jwtPayload.customerId;
    //     const latitude = _data.latitude;
    //     const longitude = _data.longitude;
    //     const myLatitude = _data.myLatitude || _data.latitude;
    //     const myLongitude = _data.myLongitude || _data.longitude;
    //     const search = _data.search;
    //     const hasService = _data.hasService;
    //     const zoom = _data.zoom || 500;
    //     const skip = _data.skip || 0;
    //     const take = _data.take || 10

    //     let builder = StoreEntity.createQueryBuilder('store')
    //         .addSelect(`ROUND( 6353 * 2 * 
    //             ASIN(SQRT( POWER(SIN((${myLatitude} - abs(store.latitude)) * pi()/180 / 2),2) 
    //             + COS(${myLatitude} * pi()/180 ) * COS( abs(store.latitude) *  pi()/180) 
    //             * POWER(SIN((${myLongitude} - store.longitude) * pi()/180 / 2), 2) ))
    //             , 2)`, 'store_distance')
    //         .addSelect(`exists (${ProductEntity.createQueryBuilder('service').select(['service.storeId', 'service.isService']).where('service.storeId = store.id').andWhere('service.isService=true').getQuery()})`, 'store_hasService')
    //         .addSelect(s => s.select('ROUND(AVG(review.rate),1)', 'store_rate').from('review', 'review').where('review.storeId=store.id'), 'store_rate')
    //         .leftJoinAndSelect('store.pictures', 'pictures')
    //         .leftJoinAndSelect('store.tags', 'tags')
    //         .leftJoinAndSelect('store.rewards', 'rewards', 'rewards.isActive=true')
    //         .leftJoinAndSelect('store.promotions', 'promotions')
    //         .leftJoinAndSelect('store.openHours', 'openHours')
    //         .leftJoinAndSelect('store.reviews', 'reviews')
    //         .where({ isActive: true })
    //         .having(`ROUND( 6353 * 2 * 
    //             ASIN(SQRT( POWER(SIN((${latitude} - abs(store.latitude)) * pi()/180 / 2),2) 
    //             + COS(${latitude} * pi()/180 ) * COS( abs(store.latitude) *  pi()/180) 
    //             * POWER(SIN((${longitude} - store.longitude) * pi()/180 / 2), 2) ))
    //             , 2) < ${zoom}`)
    //         .orderBy('store_distance')
    //         .take(+take)
    //         .skip(+skip);

    //     if (search) {
    //         builder = builder.andWhere(`LOWER(store.address) LIKE LOWER('%${search}%') OR LOWER(store.name) LIKE LOWER('%${search}%') OR LOWER(tags.name) LIKE LOWER('%${search}%') COLLATE utf8_bin OR LOWER(store.categories) LIKE LOWER('%${search}%')`);
    //     }

    //     if (hasService == 'true') {
    //         builder = builder.andHaving('`store_hasService` = true')
    //     }
    //     return await builder.getMany();
    // }

    // async getCustomerStoreDetail(storeId: number) {
    //     return  StoreEntity.createQueryBuilder('store')
    //         .addSelect(s => s
    //             .select('ROUND(AVG(review.rate),1)', 'store_rate')
    //             .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_rate')
    //         .addSelect(s => s
    //             .select('COUNT(review.id)', 'review_count')
    //             .from(ReviewEntity, 'review').where('review.storeId=store.id'), 'store_reviewCount')
    //         .addSelect(`exists (${ProductEntity.createQueryBuilder('service').where('service.storeId = store.id').andWhere('service.isService=true').getQuery()})`, 'store_hasService')
    //         .leftJoinAndSelect('store.tags', 'tags')
    //         .leftJoinAndSelect('store.pictures', 'pictures')
    //         .leftJoinAndSelect('pictures.customer', 'customer')
    //         .leftJoinAndSelect('store.rewards', 'rewards', 'rewards.isActive=true')
    //         .leftJoinAndSelect('store.promotions', 'promotions')
    //         .leftJoinAndSelect('store.openHours', 'openHours')
    //         .where({ isActive: true, id: storeId })
    //         .getOne();
    // }

    async createStore(body: CreateStoreDto, userId: number) {
        let user = await UserEntity.findOne({ where: { id: userId } });

        let newStore = StoreEntity.create(<StoreEntity>{
            name: body.name,
            categories: body.categories,
            phoneNumber: body.phoneNumber,
            email: user.email,
            address: body.address,
            city: body.city,
            zipcode: body.zipcode,
            image: body.image,
            timezone: body.timezone,
            bookingSlotSize: body.bookingSlotSize,
            notes: body.notes,
            cancelTime: body.cancelTime,
            user
        })

        newStore = await StoreEntity.save(newStore);
        let setting = new SettingEntity();
        setting.store = newStore;
        setting.save();

        let openHours = [];

        for (let i = 0; i < 7; i++) {
            openHours.push(<OpenHourEntity>{
                day: i,
                open: true,
                store: newStore
            })
        }
        OpenHourEntity.save(openHours);

        return newStore
    }

    async updateStore(id:number, body: UpdateStoreDto){
        let store = await this.getStore(id);
        return StoreEntity.save(<StoreEntity>{...store, 
            name: body.name,
            categories: body.categories,
            phoneNumber: body.phoneNumber,
            email: body.email,
            address: body.address,
            city: body.city,
            zipcode: body.zipcode,
            image: body.image,
            timezone: body.timezone,
            bookingSlotSize: body.bookingSlotSize,
            notes: body.notes,
            cancelTime: body.cancelTime,
        }) 
    }

    deleteStore(id: number){
        return StoreEntity.delete(id);
    }

    async findOneStore(id: number){
        const store = await StoreEntity.findOne({where:{id}});
        if(!store) throw new NotFoundException("Not found store");
        return store;
    }

    getStoreCategories() {
        return StoreEntity.createQueryBuilder('store')
            .select("categories")
            .distinct(true)
            .where("store.categories IS NOT NULL ")
            .andWhere("LENGTH(store.categories) > 0")
            .limit(10)
            .getRawMany();
    }
}
