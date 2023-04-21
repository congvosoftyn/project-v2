import { Module, } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInEntity } from 'src/entities/CheckIn.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { PictureEntity } from 'src/entities/Picture.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { ReviewEntity } from 'src/entities/Review.entity';
import { SiteModuleEntity } from 'src/entities/SiteModule.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { RedisCacheModule } from '../cache/redisCache.module';
import { UploadModule } from '../upload/upload.module';
import { StoreController } from './store.controller';
import { StoreResolver } from './store.resolver';
import { StoreService } from './store.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      CheckInEntity,
      OpenHourEntity,
      PictureEntity,
      ProductEntity,
      ReviewEntity,
      SiteModuleEntity,
    ]),
    RedisCacheModule,
    UploadModule,
  ],
  controllers: [StoreController],
  providers: [StoreService, StoreResolver],
})
export class StoreModule {}