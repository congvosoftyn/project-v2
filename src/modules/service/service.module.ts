import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/entities/service.entity';
import { UploadModule } from 'src/modules/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    TypeOrmModule.forFeature([ServiceEntity]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})

export class ServiceModule { }