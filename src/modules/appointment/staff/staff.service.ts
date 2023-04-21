import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentBookingEntity } from 'src/entities/Booking.entity';
import { OpenHourEntity } from 'src/entities/OpenHour.entity';
import { PackageCategoryEntity } from 'src/entities/Package.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { StaffBreakTimeEntity } from 'src/entities/StaffBreakTime.entity';
import { StaffTimeOffEntity } from 'src/entities/TimeOff.entity';
import { StaffWorkingHourEntity } from 'src/entities/WorkingHour.entity';
import { DataBookingI } from './dto/data-booking.interface';
import { BookingInfo } from './dto/data-convert.dto';
import { QueryBookingByStaffDto } from './dto/query-booking-staff.dto';
import { QueryStaffServices } from './dto/query-staff-services.dto';
import { QueryStaffDto } from './dto/query-staff.dto';
import { PaginationDto } from "../../../shared/dto/pagination.dto";
import { AddServiceToStaffDto } from './dto/add-service-to-staff.dto';

@Injectable()
export class StaffService {
  async getStaffs(storeId: number, query: QueryStaffServices = new QueryStaffServices()) {
    // const staffB = await StaffEntity.createQueryBuilder('s')
    //   .leftJoinAndMapMany(
    //     's.services',
    //     'product',
    //     'services',
    //     'services.id IN (select sp.productId from `staff_services_product` sp where sp.staffId = s.id) and services.isActive = true',
    //   )
    //   .leftJoinAndMapMany(
    //     's.workingHours',
    //     'staff_working_hour',
    //     'w',
    //     'w.staffId = s.id',
    //   )
    //   .leftJoinAndMapMany(
    //     's.breakTimes',
    //     'staff_break_time',
    //     'b',
    //     'b.staffId = s.id',
    //   )
    //   .leftJoinAndMapMany(
    //     's.timeOffs',
    //     'staff_time_off',
    //     't',
    //     't.staffId = s.id',
    //   )
    //   .where('s.storeId=:storeId', { storeId })
    //   .andWhere('s.isActive = true')
    //   .orderBy('s.name', 'ASC')
    //   .take(query.size)
    //   .skip(query.page * query.size)
    //   .getQuery();
    const [staffs, count] = await StaffEntity.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.services', 'services', 'services.isActive = true',)
      .leftJoinAndSelect('staff.workingHours', 'workingHours')
      .leftJoinAndSelect('staff.breakTimes', 'breakTimes')
      .leftJoinAndSelect('staff.timeOffs', 'timeOffs')
      .where('staff.storeId = :storeId', { storeId })
      .andWhere('staff.isActive = true')
      .groupBy('staff.id, services.id, workingHours.id, breakTimes.id, timeOffs.id')
      .orderBy('staff.name', 'ASC')
      .take(query.size)
      .skip(query.page * query.size)
      .getManyAndCount();

    return new PaginationDto(staffs, count, query.page, query.size);
  }

  async getStaffByServices(query: QueryStaffServices, storeId: number) {
    const packageIds = query.packageIds ? query.packageIds?.toString().split(",").map(Number) : [];
    let serviceIds = query.serviceIds ? query.serviceIds.toString().split(",").map(Number) : [];
    let packages = [];

    if (packageIds.length > 0) {
      packages = await PackageCategoryEntity.createQueryBuilder('package')
        .leftJoinAndSelect("package.services", "services", "services.isActive = true")
        .where("package.id in (:packageIds) ", { packageIds })
        .getRawMany();

      for (const pack of packages) {
        if (pack.services_id) {
          serviceIds.push(pack.services_id)
        }
      }
    }

    let _query = StaffEntity.createQueryBuilder('staff')
      .leftJoin("staff.services", "services", "services.isService = true and services.isActive = true")
      .leftJoinAndSelect('staff.workingHours', 'workingHours')
      .leftJoinAndSelect('staff.breakTimes', 'breakTimes')
      .where(`staff.storeId = :storeId`, { storeId })
      .orderBy("staff.id", "ASC")

    if (serviceIds.length > 0) {
      _query = _query.andWhere('services.id in (:ids)', { ids: serviceIds })
    }

    return _query.getMany()
  }

  // async getStaffsCalendar(storeId: number, companyId: number, query: QueryStaffDto) {
  //   let staffs = await StaffEntity.createQueryBuilder('staff')
  //     .leftJoinAndSelect('staff.services', 'services', 'services.isActive = true',)
  //     .leftJoinAndSelect('staff.workingHours', 'workingHours')
  //     .leftJoinAndSelect('staff.breakTimes', 'breakTimes')
  //     .leftJoinAndSelect('staff.timeOffs', 'timeOffs')
  //     .leftJoinAndSelect('staff.booking', 'booking', "booking.isActive = true")
  //     .leftJoinAndSelect('booking.customer', 'customer')
  //     .leftJoin('customer.companyCustomer', 'companyCustomer', 'companyCustomer.companyId = :companyId', { companyId })
  //     .where('staff.storeId = :storeId', { storeId })
  //     .andWhere('staff.isActive = true')
  //     .andWhere("booking.date >= :startDate", { startDate: query.startDate })
  //     .andWhere("booking.date <= :endDate", { endDate: query.endDate })

  //   if (query.staffId && +query.staffId === -1) {
  //     // Working Staff
  //     staffs = staffs.andWhere("length(booking) > 0")
  //   }
  //   if (query.staffId && +query.staffId !== -1) {
  //     staffs = staffs.andWhere(`staff.id = ${+query.staffId}`)
  //   }

  //   return staffs.getMany();
  // }

  async createStaff(staff: StaffEntity, storeId: number) {
    staff.storeId = storeId;
    let isNew = !staff.id;
    let newStaff = await StaffEntity.save(staff);

    if (isNew) {
      const storeOpenHours = await OpenHourEntity.find({ where: { storeId: storeId } })
      if (storeOpenHours && storeOpenHours.length > 0) {
        newStaff.workingHours = [];
        for (const w of storeOpenHours) {
          const workingHour = new StaffWorkingHourEntity();
          workingHour.day = w.day;
          workingHour.fromHour = w.fromHour;
          workingHour.toHour = w.toHour;
          workingHour.open = w.open;
          workingHour.staffId = newStaff.id;
          newStaff.workingHours.push(workingHour);
        }
      }
    }
    newStaff = await StaffEntity.save(newStaff);
    return newStaff;
  }

  async importStaff(staffs: StaffEntity[], storeId: number) {
    for (let i = 0; i < staffs.length; i++) {
      staffs[i].storeId = storeId;
      await this.newStaffWorkingHour(staffs[i]);
    }
    await StaffEntity.save(staffs);
    return staffs;
  }

  async deleteStaff(id: number) {
    const delete_staff = await StaffEntity.findOneBy({ id });
    delete_staff.isActive = false;
    delete_staff.directLink = null;

    if (!delete_staff) throw new NotFoundException(id);
    return StaffEntity.save(delete_staff);
  }

  private async newStaffWorkingHour(staff: StaffEntity) {
    const storeOpenHours = await OpenHourEntity.find({ where: { storeId: staff.storeId }, });
    if (storeOpenHours && storeOpenHours.length > 0) {
      staff.workingHours = [];
      for (let w of storeOpenHours) {
        let workingHour = new StaffWorkingHourEntity();
        workingHour.day = w.day;
        workingHour.fromHour = w.fromHour;
        workingHour.toHour = w.toHour;
        workingHour.open = w.open;
        staff.workingHours.push(workingHour);
      }
    }
  }

  async getBookingByStaff(query: QueryBookingByStaffDto, storeId: number, companyId: number) {
    let _staffs = []
    let query_staff = StaffEntity.createQueryBuilder('staff')
      .leftJoinAndSelect("staff.workingHours", "workingHours")
      .leftJoinAndSelect("staff.breakTimes", "breakTimes")
      .leftJoinAndSelect("staff.timeOffs", "timeOffs")
      .where("staff.storeId = :storeId ", { storeId: storeId });

    let query_booking = AppointmentBookingEntity.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoin('customer.companyCustomer', 'companyCustomer', 'companyCustomer.companyId = :companyId', { companyId })
      .leftJoinAndSelect('booking.bookingInfo', 'bookingInfo')

    if (query.view === 'day') {
      query_booking = query_booking.andWhere("DATE(booking.date) = :day", { day: query.date })
    }

    if (query.staffId === 'working') {
      query_staff = query_staff
        .andWhere(`workingHours.day = ${new Date().getDay()} 
        and staff.id not in (${StaffTimeOffEntity.createQueryBuilder('time_off').select("time_off.staffId")
            .where(`DATE(time_off.endDate) = ${query.date}`).andWhere("HOUR(TIMEDIFF(time_off.endDate, time_off.startDate))-8 >= 0")
            .groupBy("time_off.staffId").getSql()})
          `)
    }

    if (+query.staffId) {
      query_staff = query_staff.andWhere("staff.id = :id", { id: +query.staffId })
    }

    if (query.view === 'day_3' || query.view === 'week') {
      let curr = new Date;

      let first = curr.getDate() - curr.getDay();
      let last = first + 6;
      let firstday, lastday;

      if (query.view === 'day_3') {
        firstday = new Date()
        lastday = new Date()
        firstday.setDate(firstday.getDate() - 1)
        lastday.setDate(lastday.getDate() + 1)
      } else if (query.view === 'week') {
        firstday = new Date(curr.setDate(first)).toUTCString()
        lastday = new Date(curr.setDate(last)).toUTCString()
      }

      if (+query.staffId) {
        query_staff = query_staff.andWhere("staff.id = :id", { id: +query.staffId })
      }

      query_booking = query_booking.andWhere("DATE(booking.date) between :firstday and :lastday", { firstday: firstday, lastday: lastday })
    }

    let staffs = await query_staff.getMany();

    let bookings = await query_booking.groupBy("booking.id").addGroupBy("bookingInfo.staffId").getMany();

    for (let staff of staffs) {
      _staffs.push(this.convertDataBookingByStaff(bookings, staff))
    }

    return _staffs
  }

  getDateInWeek(firstday: string) {
    let date1 = new Date(this.format(new Date(firstday)))
    let date2 = new Date(this.format(new Date()))

    return (date2.getTime() - date1.getTime()) / (1000 * 24 * 60 * 60)
  }

  async updateStaff(staff: StaffEntity) {
    let _staff = await StaffEntity.createQueryBuilder('staff')
      .leftJoinAndSelect("staff.services", "services", "services.isActive = true")
      .leftJoinAndSelect("staff.workingHours", "workingHours")
      .leftJoinAndSelect("staff.breakTimes", "breakTimes")
      .leftJoinAndSelect("staff.timeOffs", "timeOffs")
      .where("staff.id = :id", { id: staff.id })
      .getOne()

    let staffUp = await StaffEntity.merge(_staff, staff);

    return StaffEntity.save(staffUp);
  }

  deleteBreakTime(id: number) {
    return StaffBreakTimeEntity.delete(id);
  }

  async getStaff(id: number, storeId: number) {
    const staff = await StaffEntity.createQueryBuilder('staff')
      .leftJoin('staff.store', 'store')
      .leftJoinAndSelect("staff.bookingInfos", "bookingInfos")
      .leftJoinAndSelect("bookingInfos.service", "service", "service.isActive = true")
      .leftJoinAndSelect("bookingInfos.packages", "packages")
      .leftJoinAndSelect("bookingInfos.booking", "booking", "booking.isActive = true")
      .where('staff.id = :id and staff.storeId = :storeId', { id, storeId })
      // .groupBy("booking.id")
      // .addGroupBy("staff.id")
      .getOne();

    return this.convertBooking(staff)

    // let staff = await StaffEntity.createQueryBuilder("staff").where("staff.id = :id and staff.storeId = :storeId", { id: id, storeId }).getOne()

    // let bookings = await AppointmentBookingEntity.createQueryBuilder('booking')
    //   .leftJoinAndSelect("booking.bookingInfo", "bookingInfo")
    //   .where("DATE(booking.date) = :day", { day: "2022-11-25" })
    //   .groupBy("booking.id")
    //   .addGroupBy("bookingInfo.staffId")
    //   .getMany()

    // return { response: this.convertDataBookingByStaff(bookings, staff) };
  }

  convertBooking(staff: StaffEntity) {
    let bookings: DataBookingI[] = []
    let bookingInfos = staff.bookingInfos

    bookingInfos.forEach((bInfo) => {
      let _data = []
      let data = bookings.find((booking) => booking.bookingId == bInfo.bookingId)

      if (!data) {
        _data.push(bInfo);
        bookings.push({ bookingId: bInfo.bookingId, data: _data })
      } else {
        let index = bookings.findIndex((booking) => booking.bookingId === bInfo.bookingId)

        let data01 = bookings[index].data
        data01.push(bInfo)

        bookings[index] = { ...bookings[index], data: data01 }
      }
    })

    let _bookings = []

    for (let booking of bookings) {
      _bookings.push(this.convertData(booking.data))
    }

    return { ...staff, bookings: _bookings, bookingInfos: undefined }
  }

  convertData(data: BookingInfo[]) {
    let services = []
    let packages = []

    data.forEach((_data) => {
      if (_data.serviceId) {
        services.push({ ..._data.service, bookingInfoId: _data.id, deleted: _data.deleted, staffId: _data.staffId })
      }
      if (_data.packageId) {
        packages.push({ ..._data.packages, bookingInfoId: _data.id, deleted: _data.deleted, staffId: _data.staffId })
      }
    })

    return { ...data[0].booking, services, packages }

  }

  format(inputDate: Date) {
    var date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
      var day = date.getDate().toString();
      var month = (date.getMonth() + 1).toString();
      // Months use 0 index.

      return (month[1] ? month : '0' + month[0]) + '/' +
        (day[1] ? day : '0' + day[0]) + '/' +
        date.getFullYear();
    }
  }

  convertReponseBooking(booking: AppointmentBookingEntity) {
    let services = []
    let packages = []

    booking?.bookingInfo?.forEach((bI) => {
      if (bI.serviceId) {
        services.push({ ...bI.service, bookingInfoId: bI.id, deleted: bI.deleted, staffId: bI.staffId, staff: bI.staff })
      }
      if (bI.packageId) {
        packages.push({ ...bI.packages, bookingInfoId: bI.id, deleted: bI.deleted, staffId: bI.staffId, staff: bI.staff })
      }
    })

    packages = packages.map((_package) => {
      return ({
        ..._package,
        duration: _package?.services?.reduce((a, b) => a + b.serviceDuration, 0)
      })
    })

    let _booking = {
      ...booking,
      bookingInfo: undefined,
      services: services,
      packages: packages
    }

    return _booking;
  }

  convertDataBookingByStaff(listBooking: AppointmentBookingEntity[], staff: StaffEntity) {
    let _staff = staff as any;
    let _bookings = [];

    listBooking?.forEach((booking) => {
      booking?.bookingInfo?.forEach((bInfo) => {
        if (bInfo.staffId === _staff.id) {
          let _booking = { ...booking, bookingInfo: booking?.bookingInfo?.filter((bI) => bI.staffId === staff.id) }
          _bookings.push(_booking)
        }
      })
    })

    _staff = { ..._staff, bookings: _bookings }

    return _staff
  }

  async addServiceToStaff(staffId: number, storeId: number, body: AddServiceToStaffDto) {
    let staff = await StaffEntity.findOne({ where: { id: staffId, storeId: storeId }, relations: ["services"] })
    staff.services = body.services;
    return StaffEntity.save(staff);
  }

}
