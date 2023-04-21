import { Module } from '@nestjs/common';
import { NotifyService } from './notify.service';
import {HttpModule} from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule { }
