import { UserEntity } from 'src/entities/User.entity';
import { CancelBookingDto, UpdateBookingDto } from './dto/update-booking.dto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppointmentBookingEntity } from 'src/entities/Booking.entity';
import { StaffEntity } from 'src/entities/Staff.entity';
import { StaffTimeOffEntity } from 'src/entities/TimeOff.entity';
import { EmailService } from 'src/modules/email/email.service';
import { BookingGateway } from './booking.gateway';
import { QueryHistoryByDateDto } from './dto/QueryHistoryByDate.dto';
import { CreateAppointmentDto } from './dto/create-booking.dto';
import { AppointmentInfoEntity } from 'src/entities/BookingDetail.entity';
import { NotifyService } from 'src/modules/notify/notify.service';

@Injectable()
export class BookingService {
    constructor(
        private readonly emailService: EmailService,
        @Inject(forwardRef(() => BookingGateway))
        private bookingGateway: BookingGateway,
        private readonly notifyService: NotifyService
    ) { }

    async getHistoryStatus(_query: QueryHistoryByDateDto, storeId: number) {
        const { start, end, staffId } = _query;

        let query = AppointmentBookingEntity
            .createQueryBuilder('booking')
            .leftJoin('booking.service', 'service', 'service.isService = true')
            .select("date_format(booking.date,'%Y-%m-%d')", "created")
            .addSelect("COUNT(booking.id)", "count")
            .addSelect('SUM(service.serviceDuration)', 'totalMinute')
            .orderBy({ created: 'ASC' })
            .groupBy("DATE(booking.date)")
            .where('booking.storeId = :storeId', { storeId })
            .andWhere('booking.date >= :start', { start })
            .andWhere('booking.date < :end', { end })
            .andWhere('booking.isActive=true')

        if (staffId) {
            query = query.andWhere('staffId = :staffId', { staffId })
        }
        return query.getRawMany();;
    }

    async getAppointments(storeId: number, companyId: number) {
        let bookings = await AppointmentBookingEntity.createQueryBuilder('booking')
            .leftJoinAndSelect('booking.customer', 'customer')
            .leftJoin('customer.companyCustomer', 'companyCustomer', 'companyCustomer.companyId = :companyId', { companyId })
            .leftJoinAndSelect('booking.bookingInfo', 'bookingInfo')
            .leftJoinAndSelect('bookingInfo.service', 'service', 'service.isService = true')
            .leftJoinAndSelect('bookingInfo.packages', 'packages')
            .leftJoinAndSelect('packages.services', '_services', '_services.isService = true')
            .leftJoinAndSelect('bookingInfo.staff', 'staff')
            .leftJoinAndSelect("booking.label", "label")
            .orderBy({ date: 'ASC' })
            .where("booking.storeId = :storeId", { storeId })
            .addSelect('companyCustomer.nickname')
            .addSelect('companyCustomer.id')
            .andWhere('booking.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)')
            .andWhere('booking.isActive = true')
            .getMany();

        let _bookings = []

        for (let booking of bookings) {
            _bookings.push(this.convertReponseBooking(booking))
        }

        return _bookings
    }

    async createBookAppointment(booking: CreateAppointmentDto, storeId: number, companyId?: number) {
        const services = booking.services ? booking.services : [];
        const packages = booking.packages ? booking.packages : []

        if (!booking.storeId && storeId) booking.storeId = storeId;

        booking.services = undefined;
        booking.packages = undefined;

        booking.lastDate = booking.date;

        const newbooking = await AppointmentBookingEntity.save(booking as AppointmentBookingEntity);

        let _services = []
        let _packages = []

        for (const service of services) {
            _services.push({
                bookingId: newbooking.id,
                price: parseFloat(service.price.toString()),
                staffId: service.staffId,
                serviceId: service.id
            });
        }
        for (const _package of packages) {
            _packages.push({
                bookingId: newbooking.id,
                price: _package.price,
                staffId: _package.staffId,
                packageId: _package.id
            });
        }

        await AppointmentInfoEntity.save(_services as unknown as AppointmentInfoEntity)
        await AppointmentInfoEntity.save(_packages as unknown as AppointmentInfoEntity)

        return await this.findByBooking(newbooking.id)
    }

    async findByBooking(id: number) {
        const booking = await AppointmentBookingEntity.createQueryBuilder('booking')
            .leftJoinAndSelect("booking.bookingInfo", "bookingInfo")
            .leftJoinAndSelect("bookingInfo.service", "service", "service.isService = true")
            .leftJoinAndSelect("service.tax", "tax")
            .leftJoinAndSelect("bookingInfo.staff", "staff")
            .leftJoinAndSelect("bookingInfo.packages", "packages")
            .leftJoinAndSelect("packages.services", "_services", "_services.isService = true")
            .leftJoinAndSelect("_services.tax", "_tax")
            .leftJoinAndSelect("booking.label", "label")
            .leftJoinAndSelect("booking.customer", "customer")
            .where('booking.id = :id', { id })
            .getOne();

        return this.convertReponseBooking(booking)
    }

    convertReponseBooking(booking: AppointmentBookingEntity) {
        let services = []
        let packages = []

        booking?.bookingInfo?.forEach((bI) => {
            // if (bI.serviceId && !bI.deleted) {
            if (bI.serviceId) {
                services.push({ ...bI.service, bookingInfoId: bI.id, deleted: bI.deleted, staffId: bI.staffId, staff: bI.staff, tax: bI?.service?.tax })
            }
            if (bI.packageId) {
                packages.push({ ...bI.packages, bookingInfoId: bI.id, deleted: bI.deleted, staffId: bI.staffId, staff: bI.staff })
            }
        })

        packages = packages.map((_package) => {
            return ({
                ..._package,
                duration: _package.services.reduce((a, b) => a + b.serviceDuration, 0)
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

    async getHistoryByDate(_query: QueryHistoryByDateDto, storeId: number, companyId: number) {
        const { start, end, staffId } = _query;

        let query = StaffEntity.createQueryBuilder('staff')
            .leftJoin("staff.bookingInfo", "bookingInfo")
            .leftJoin("bookingInfo.booking", "booking")
            .leftJoin('booking.customer', 'customer')
            .leftJoin('customer.companyCustomer', 'companyCustomer', 'companyCustomer.companyId = :companyId', { companyId })
            .leftJoin('booking.service', 'service', 'service.isService = true AND service.isActive = true')
            .select([
                "staff.id as staffId", "staff.storeId as storeId",
                "staff.name as staffName", "booking.id as bookingId",
                "booking.storeId as bookingStoreId",
                "booking.duration as duration", "booking.date as date",
                "booking.color as color", "booking.serviceId as serviceId",
                "service.name as serviceName", "service.price as servicePrice",
                "service.cost as serviceCost", "service.serviceDuration as serviceDuration",
            ])
            .where(`staff.storeId = :storeId AND (${staffId && +staffId === -1 ? "booking.id is null or" : ''} (booking.isActive = true AND booking.date between :start and :end AND booking.storeId = :storeId))`, { storeId, start, end })
            .groupBy("staffId, storeId, bookingId")

        if (staffId && +staffId !== -1 && +staffId !== 0) {
            query = query.andWhere(`staff.id = :staffId`, { staffId: +staffId })
        }

        return query.getRawMany();
    }

    getHistoryByCustomer(id: number, storeId: number) {
        return AppointmentBookingEntity.find({ where: { storeId, customerId: id }, order: { date: 'DESC' } })
    }

    async updateAppointment(bookingId: number, booking: UpdateBookingDto, userId: number) {
        let services = booking.services ? booking.services : [];
        let packages = booking.packages ? booking.packages : [];

        let bDeletedInfoIds = []

        services.concat(packages)?.forEach((service) => {
            if (service?.bookingInfoId) {
                if (service.delete) {
                    bDeletedInfoIds.push(service.bookingInfoId)
                }
            }
        })

        services = booking.services ? booking.services : [];
        packages = booking.packages ? booking.packages : [];

        let _packages = []
        let _services = []
        let _existedServices = []
        let _existedPackages = []

        for (const service of services) {
            if (!service.bookingInfoId) {
                _services.push(<AppointmentInfoEntity>{
                    bookingId: bookingId,
                    price: parseFloat(service.price.toString()),
                    staffId: service.staffId,
                    serviceId: service.id
                })
            } else {
                _existedServices.push(<AppointmentInfoEntity>{
                    id: service.bookingInfoId,
                    bookingId: bookingId,
                    price: parseFloat(service.price.toString()),
                    staffId: service.staffId,
                    serviceId: service.id
                })
            }
        }
        AppointmentInfoEntity.save(_existedServices);
        AppointmentInfoEntity.save(_services);

        for (const _package of packages) {
            if (!_package.bookingInfoId) {
                _packages.push(<AppointmentInfoEntity>{
                    bookingId: bookingId,
                    price: _package.price,
                    staffId: _package.staffId,
                    packageId: _package.id
                })
            } else {
                _existedPackages.push(<AppointmentInfoEntity>{
                    id: _package.bookingInfoId,
                    bookingId: bookingId,
                    price: _package.price,
                    staffId: _package.staffId,
                    packageId: _package.id
                })
            }
        }
        AppointmentInfoEntity.save(_existedPackages);
        AppointmentInfoEntity.save(_packages);

        if (bDeletedInfoIds.length > 0) {
            AppointmentInfoEntity.createQueryBuilder().update({ deleted: true }).where("id IN (:ids)", { ids: bDeletedInfoIds }).execute()
        }

        booking.services = undefined;
        booking.packages = undefined;

        await AppointmentBookingEntity.createQueryBuilder().update(booking).where("id = :id", { id: bookingId }).execute()
        const user = await this.getUser(userId)
        let topic = user.email.replace(/[^\w\s]/gi, '')
        this.notifyService.sendhNotiTopic(topic, `Booking is updated!`)

        return this.findByBooking(bookingId)
    }

    async cancelAppointment(id: number, booking: CancelBookingDto, userId: number) {
        const result = await AppointmentBookingEntity.createQueryBuilder().update({ status: booking.status, reason: booking.reason }).where("id = :id ", { id }).execute();
        const user = await this.getUser(userId)
        let topic = user.email.replace(/[^\w\s]/gi, '')
        this.notifyService.sendhNotiTopic(topic, `Booking is ${booking.status}!`)
        return result
    }

    async deleteAppointment(id: number, storeId: number, userId: number) {
        const deleteB = await AppointmentBookingEntity.findOneBy({ id });
        if (deleteB.isActive === false) return deleteB;

        const user = await this.getUser(userId)
        let topic = user.email.replace(/[^\w\s]/gi, '')
        this.notifyService.sendhNotiTopic(topic, 'Booking is deleted!')

        return AppointmentBookingEntity.createQueryBuilder().update({ isActive: false }).where("id = :id and storeId = :storeId", { id, storeId }).execute();
    }


    // async getCalendarSlot(date: Date, staffId: number) {

    //     const staff = await StaffEntity.findOne({ where: { id: staffId } });
    //     // if (!staff) next(new NotFoundException(`${staffId}` as string));

    //     const bookingSetting = await AppointmentSettingEntity.findOne({ where: { storeId: staff.storeId } });
    //     const storeSetting = await StoreSettingEntity.findOne({ where: { storeId: staff.storeId } });
    //     let stringToDate = new Date(`${date}` as string);
    //     stringToDate = this.changeTimezone(stringToDate, storeSetting.timeZone);
    //     const startDate = new Date(stringToDate);
    //     startDate.setHours(0, 0, 0, 0);
    //     const endDate = new Date(startDate);
    //     endDate.setDate(endDate.getDate() + 1);
    //     let slots: { time: Date, open: boolean }[] = this.getAllSlots(startDate, endDate, bookingSetting.appointmentSlots);
    //     const booking = await AppointmentBookingEntity.createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .where('booking.storeId = :storeId', { storeId: staff.storeId })
    //         .andWhere('booking.isActive = true')
    //         .andWhere('booking.staffId = :staffId', { staffId: staff.id })
    //         .andWhere('booking.date between :startDate and :endDate', { startDate, endDate })
    //         .getMany();

    //     const getWorkingDay = staff.workingHours.find(w => w.day === stringToDate.getDay());
    //     let workingStart = this.convertStringToTime(getWorkingDay.fromHour, stringToDate, storeSetting.timeZone);
    //     let workingEnd = this.convertStringToTime(getWorkingDay.toHour, stringToDate, storeSetting.timeZone);
    //     for (let i = 0; i < slots.length; i++) {
    //         if (!getWorkingDay.open) slots[i].open = false;
    //         else if (slots[i].time < workingStart || slots[i].time > workingEnd) slots[i].open = false;
    //         else if (booking.length > 0 && booking.some(b => {
    //             const end = new Date(b.date)
    //             end.setMinutes(end.getMinutes() + b.service.serviceDuration)
    //             return slots[i].time >= b.date && slots[i].time < end;
    //         })) {
    //             slots[i].open = false;
    //         } else if (staff.breakTimes.some(b => {
    //             const fromhhmm = b.fromHour.split(':');
    //             const endhhmm = b.toHour.split(':');
    //             let start = new Date(slots[i].time);
    //             start.setHours(+fromhhmm[0], +fromhhmm[1]);
    //             let end = new Date(slots[i].time);
    //             end.setHours(+endhhmm[0], +endhhmm[1]);
    //             return (b.day === slots[i].time.getDay() && slots[i].time >= start && slots[i].time < end)
    //         })) {
    //             slots[i].open = false;
    //         } else if (this.checkIfDayOff(staff.timeOffs, slots[i].time)) {
    //             slots[i].open = false;
    //         }
    //     }

    //     return slots;
    // }


    // // ex: /appointment/booking/slots/?date=06-13-2021&timezone=America/Chicago&staffId=9
    // async getBookingSlots(_query: QueryBookingSlotsDto) {
    //     const { date, timezone, staffId } = _query;
    //     const staff = await StaffEntity.findOne({ where: { id: staffId } });
    //     if (!staff) {

    //         throw new NotFoundException(`not found with id ${staffId}`);
    //     }

    //     const bookingSetting = await AppointmentSettingEntity.findOne({ where: { storeId: staff.storeId } });
    //     const storeSetting = await StoreSettingEntity.findOne({ where: { storeId: staff.storeId } });
    //     let stringToDate = new Date(`${date}` as string);

    //     let pickedday = this.changeTimezone(stringToDate, `${timezone}` as string);
    //     const getWorkingDay = staff.workingHours.find(w => w.day === pickedday.getDay());
    //     let workingStart = this.convertStringToTime(getWorkingDay.fromHour, stringToDate, storeSetting.timeZone, `${timezone}` as string);
    //     let workingEnd = this.convertStringToTime(getWorkingDay.toHour, stringToDate, storeSetting.timeZone, `${timezone}` as string);
    //     // if(stringToDate > workingStart) {
    //     //     workingStart = stringToDate;
    //     // }

    //     let today = new Date();
    //     let available: { time: Date, open: boolean }[] = this.getAllSlots(workingStart, workingEnd, bookingSetting.bookingSlotSize);
    //     let booking = await AppointmentBookingEntity.createQueryBuilder('booking')
    //         .leftJoinAndSelect('booking.service', 'service')
    //         .where('booking.storeId = :storeId', { storeId: staff.storeId })
    //         .andWhere('booking.isActive = true')
    //         .andWhere('booking.staffId = :staffId', { staffId: staff.id })
    //         .andWhere('booking.date between :workingStart and :workingEnd', { workingStart, workingEnd })
    //         .getMany();
    //     for (let i = 0; i < available.length; i++) {
    //         if (!getWorkingDay.open) available[i].open = false;
    //         else if (today > available[i].time) available[i].open = false;
    //         else if (booking.length > 0 && booking.some(b => {
    //             const end = new Date(b.date)
    //             end.setMinutes(end.getMinutes() + b.service.serviceDuration)
    //             return available[i].time >= b.date && available[i].time < end;
    //         })) {
    //             available[i].open = false;
    //         } else if (staff.breakTimes.some(b => {
    //             const fromhhmm = b.fromHour.split(':');
    //             const endhhmm = b.toHour.split(':');
    //             let start = new Date(pickedday);
    //             start.setHours(+fromhhmm[0], +fromhhmm[1]);
    //             let end = new Date(pickedday);
    //             end.setHours(+endhhmm[0], +endhhmm[1]);
    //             return (b.day === available[i].time.getDay() && available[i].time >= start && available[i].time < end)
    //         })) {
    //             available[i].open = false;
    //         } else if (this.checkIfDayOff(staff.timeOffs, available[i].time)) {
    //             available[i].open = false;
    //         }
    //     }

    //     return available;
    // }



    checkIfDayOff(timeOffs: StaffTimeOffEntity[], pickedDate: Date) {

        for (let i = 0; i < timeOffs.length; i++) {
            //check timeoff
            let timeoff = timeOffs[i];
            const end = new Date(timeoff.endDate);
            let start = new Date(timeoff.startDate);
            if (end < pickedDate) return false;
            if (timeoff.repeat) {
                if (timeoff.repeat == 'daily') {
                    if (pickedDate >= timeoff.startDate && pickedDate <= end) {
                        while (start < end) {
                            if ((start.getDate() === pickedDate.getDate()) && (start.getMonth() === pickedDate.getMonth()) && (start.getFullYear() === pickedDate.getFullYear())) {
                                if (timeoff.allDay) {
                                    return true;
                                } else {
                                    const dayEnd = new Date(start);
                                    dayEnd.setMinutes(dayEnd.getMinutes() + timeoff.duration)
                                    if (pickedDate > start && pickedDate < dayEnd) {
                                        return true;
                                    }
                                }
                            }
                            start.setDate(start.getDate() + timeoff.repeatEvery);
                        }

                    }
                } else if (timeoff.repeat == 'weekly') {
                    const timeOff = timeoff.repeatOn.map(Number);
                    if (timeOff.includes(pickedDate.getDay())) {
                        if (pickedDate >= start && pickedDate <= end) {
                            let nextDay = new Date(pickedDate);
                            for (let day of timeOffs) {
                                if (timeoff.allDay) {
                                    return true;
                                } else {
                                    const dayEnd = new Date(nextDay);
                                    dayEnd.setMinutes(dayEnd.getMinutes() + timeoff.duration)
                                    if (pickedDate > nextDay && pickedDate < dayEnd) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                } else if (timeoff.repeat == 'monthly') {
                    if (pickedDate >= timeoff.startDate && pickedDate <= timeoff.endDate) {
                        while (start < timeoff.endDate) {
                            if ((start.getDate() === pickedDate.getDate()) && (start.getMonth() === pickedDate.getMonth()) && (start.getFullYear() === pickedDate.getFullYear())) {
                                if (timeoff.allDay) {
                                    return true;
                                } else {
                                    const dayEnd = new Date(start);
                                    dayEnd.setMinutes(dayEnd.getMinutes() + timeoff.duration)
                                    if (pickedDate > start && pickedDate < dayEnd) {
                                        return true;
                                    }
                                }
                            }
                            start.setMonth(start.getMonth() + timeoff.repeatEvery);
                        }

                    }

                }
            } else {
                if (pickedDate >= timeoff.startDate && pickedDate <= timeoff.endDate) {
                    return true;
                }
            }
        }
        return false;
    }


    getAllSlots(fromDate: Date, toDate: Date, interval: number) {
        let arr = [];
        let current = new Date(fromDate);
        while (current <= toDate) {
            arr.push({ time: new Date(current), open: true });
            current.setMinutes(current.getMinutes() + interval);
        }
        return arr;
    }

    convertStringToTime(time: string, pickDate: Date, storeTimezone: string, customerTimezone: string = '') {
        const [hh, mm] = time.split(':');
        //change timezone to store timezone
        let result = this.changeTimezone(pickDate, storeTimezone);
        result.setHours(+hh, +mm);
        //change timezone customer timezone
        if (customerTimezone)
            result = this.changeTimezone(result, customerTimezone);
        return result;
    }

    changeTimezone(date: Date, ianatz: string) {

        // suppose the date is 12:00 UTC
        var invdate = new Date(date.toLocaleString('en-US', {
            timeZone: ianatz
        }));

        // then invdate will be 07:00 in Toronto
        // and the diff is 5 hours
        var diff = date.getTime() - invdate.getTime();

        // so 12:00 in Toronto is 17:00 UTC
        return new Date(date.getTime() + diff);

    }

    getUser(userId: number) {
        return UserEntity.createQueryBuilder('user').where("user.id = :userId", { userId }).getOne();
    }
}
