import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/Product.entity';
import { ProductCategoryEntity } from 'src/entities/Category.entity';
import { ServiceResolver } from './service.resolver';
import { UploadModule } from 'src/modules/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forFeature([ProductEntity, ProductCategoryEntity]),
  ],
  providers: [ServiceService, ServiceResolver],
  controllers: [ServiceController],
})

export class ServiceModule { }