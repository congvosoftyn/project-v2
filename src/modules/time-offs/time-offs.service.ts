import { Injectable } from '@nestjs/common';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { UpdateTimeOffDto } from './dto/update-time-off.dto';
import { StaffEntity } from 'src/entities/Staff.entity';
import { TimeOffEntity } from 'src/entities/TimeOff.entity';

@Injectable()
export class TimeOffsService {
  async create(createTimeOffDto: CreateTimeOffDto) {
    const staff = await StaffEntity.findOne({ where: { id: createTimeOffDto.staffId } });
    return TimeOffEntity.save(<TimeOffEntity>{
      allDay: createTimeOffDto.allDay,
      note: createTimeOffDto.note,
      repeat: createTimeOffDto.repeat,
      repeatEvery: createTimeOffDto.repeatEvery,
      repeatOn: createTimeOffDto.repeatOn,
      staff
    })
  }

  findAll(staffId: number) {
    return TimeOffEntity.find({ where: { staffId } });
  }

  findOne(id: number) {
    return `This action returns a #${id} timeOff`;
  }

  update(id: number, updateTimeOffDto: UpdateTimeOffDto) {
    return `This action updates a #${id} timeOff`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeOff`;
  }
}
