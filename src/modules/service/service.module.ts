import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/Product.entity';
import { UploadModule } from 'src/modules/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})

export class ServiceModule { }