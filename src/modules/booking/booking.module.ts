import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingGateway } from './booking.gateway';
import { EmailModule } from 'src/modules/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyModule } from 'src/modules/notify/notify.module';
import { BookingDetailEntity } from 'src/entities/BookingDetail.entity';

@Module({
  imports: [
    EmailModule,
    NotifyModule,
    TypeOrmModule.forFeature([BookingDetailEntity])
  ],
  providers: [BookingService, BookingGateway],
  controllers: [BookingController],
  exports: [BookingService]
})

export class BookingModule { }