import { Injectable } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { DemoEntity } from 'src/entities/demo.entity';
import { QueryDemoDto } from './dto/query-demo.dto';

@Injectable()
export class DemoService {
  create(createDemoDto: CreateDemoDto) {
    return DemoEntity.save(<DemoEntity>{ name: createDemoDto.name, date: createDemoDto.date });
  }

  findAll(query: QueryDemoDto) {
    // console.log("date",date)
    const start = new Date(query.startDate);
    start.setHours(9, 0, 0, 0);
    const end = new Date(query.endDate);
    end.setHours(17, 0, 0, 0);
    console.log({ start, end })
    console.log(`date: ${start.toISOString()} `)

    return DemoEntity.createQueryBuilder("de")
      .where(`de.date between :start and :end`, { start: start.toISOString(), end: end.toISOString() })
      .getMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} demo`;
  }

  update(id: number, updateDemoDto: UpdateDemoDto) {
    return `This action updates a #${id} demo`;
  }

  remove(id: number) {
    return `This action removes a #${id} demo`;
  }
}
