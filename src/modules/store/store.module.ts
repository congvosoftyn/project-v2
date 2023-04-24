import { Module, } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { ProductEntity } from 'src/entities/Product.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { RedisCacheModule } from '../cache/redisCache.module';
import { UploadModule } from '../upload/upload.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      OpenHourEntity,
      ProductEntity,
    ]),
    RedisCacheModule,
    UploadModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports:[StoreService]
})
export class StoreModule {}