import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TimeOffsService } from './time-offs.service';
import { CreateTimeOffDto } from './dto/create-time-off.dto';
import { UpdateTimeOffDto } from './dto/update-time-off.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';

@Controller('time-offs')
@ApiTags('time-offs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthenticationGuard)
export class TimeOffsController {
  constructor(private readonly timeOffsService: TimeOffsService) {}

  @Post()
  create(@Body() createTimeOffDto: CreateTimeOffDto) {
    return this.timeOffsService.create(createTimeOffDto);
  }

  @Get("/:staffId")
  findAll(@Param("staffId") staffId: number) {
    return this.timeOffsService.findAll(staffId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.timeOffsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTimeOffDto: UpdateTimeOffDto) {
  //   return this.timeOffsService.update(+id, updateTimeOffDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.timeOffsService.remove(+id);
  // }
}
