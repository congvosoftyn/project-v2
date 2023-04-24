import { Module } from '@nestjs/common';
import { TimeOffsService } from './time-offs.service';
import { TimeOffsController } from './time-offs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOffEntity } from 'src/entities/TimeOff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeOffEntity])],
  controllers: [TimeOffsController],
  providers: [TimeOffsService]
})
export class TimeOffsModule { }
