import { Injectable } from '@nestjs/common';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { DemoEntity } from 'src/entities/demo.entity';
import { QueryDemoDto } from './dto/query-demo.dto';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DemoService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection
  ) {

  }

  create(createDemoDto: CreateDemoDto) {
    return DemoEntity.save(<DemoEntity>{
      name: createDemoDto.name, date: createDemoDto.date,
      startDate: createDemoDto.startDate,
      endDate: createDemoDto.endDate
    });
  }

  findOverlapping(id1?: number, id2?: number) {
    return DemoEntity
      .createQueryBuilder()
      .from(DemoEntity,"d1")
      .from(DemoEntity, "d2")
      // .where("de.id = 5 AND d2.id = 6")
      .getMany()
    // return this.connection.query(`
    // SELECT 
    //   case when
    //     (t1.start_date between t2.start_date and t2.end_date) or
    //         (t1.end_date between t2.start_date and t2.end_date) or
    //         (t1.start_date <t2.start_date and t1.end_date > t2.end_date) or
    //         (t1.start_date > t2.start_date and t1.end_date < t2.end_date) 
    //     then 'yes'
    //     else 'no'
    //     end as OverLapping
    // FROM charmsta.demo_time t1, charmsta.demo_time t2 
    // where t1.id = 5 and t2.id = 6
    // `);
  }

  findAll(query: QueryDemoDto) {
    const start = new Date(`${query.startDate}`);
    start.setHours(9, 0, 0, 0);
    const end = new Date(`${query.endDate}`);
    end.setHours(17, 0, 0, 0);
    // console.log({ start, end })
    // console.log(`date: ${start.toISOString()} `)

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
