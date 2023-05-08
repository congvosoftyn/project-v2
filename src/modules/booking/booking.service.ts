import { UserEntity } from "src/entities/User.entity";
import { CancelBookingDto, UpdateBookingDto } from "./dto/update-booking.dto";
import { forwardRef, Inject, Injectable, NotFoundException, } from "@nestjs/common";
import { StaffEntity } from "src/entities/Staff.entity";
import { EmailService } from "src/modules/email/email.service";
import { BookingGateway } from "./booking.gateway";
import { CreateAppointmentDto, } from "./dto/create-booking.dto";
import { NotifyService } from "src/modules/notify/notify.service";
import { BookingEntity } from "src/entities/Booking.entity";
import { BookingDetailEntity } from "src/entities/BookingDetail.entity";
import { TimeOffEntity } from "src/entities/TimeOff.entity";
import { QueryBookingSlotsDto } from "./dto/QueryBookingSlots.dto";
import { SettingEntity } from "src/entities/Setting.entity";
import { IListBookingDetail } from "./interfaces/list-booking-detail.interface";
import { PackageEntity } from "src/entities/Package.entity";
import { In } from "typeorm";
import { format } from "date-fns";
import { ITimeOverlap } from "./interfaces/time-overlap.interface";
import { ServiceEntity } from "src/entities/service.entity";
import { CustomerEntity } from "src/entities/Customer.entity";
import { DrapBookingDetailDto } from "./dto/drap-booking-detail.dto";

@Injectable()
export class BookingService {
    constructor(
        private readonly emailService: EmailService,
        @Inject(forwardRef(() => BookingGateway))
        private bookingGateway: BookingGateway,
        private readonly notifyService: NotifyService
    ) { }

    async getAppointments(storeId: number) {
        return BookingEntity.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.customer", "customer")
            .leftJoinAndSelect("booking.bookingDetails", "bookingDetails")
            .leftJoin("bookingDetails.service", "service")
            .leftJoin("bookingDetails.package", "package")
            .leftJoin("bookingDetails.staff", "staff")
            .addSelect([
                "service.id", "service.name", "service.price", "service.duration",
                "package.id", "package.name", "package.price", "package.duration",
                "staff.id", "staff.name"
            ])
            .orderBy({ date: "ASC" })
            .where("booking.storeId = :storeId", { storeId })
            .andWhere("booking.date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)")
            .andWhere("booking.isActive = false")
            .getMany();
    }

    async createBookAppointment(bodyBooking: CreateAppointmentDto, storeId: number) {
        const serviceIds: number[] = bodyBooking.serviceIds;
        const packageIds: number[] = bodyBooking.packageIds;
        let duration = bodyBooking.extraTime;
        let startTime: string = bodyBooking.startTime;
        const customer = await CustomerEntity.findOne({ where: { id: bodyBooking.customerId } });
        const staff = await StaffEntity.findOne({ where: { id: bodyBooking.staffId } });

        let listBookingDetailsDto: IListBookingDetail[] = [];

        if (serviceIds && serviceIds.length > 0) {
            const services = await ServiceEntity.find({ where: { id: In(serviceIds) } });
            for (const service of services) {
                let endTime = this.addMinutes(startTime, service.duration);
                duration += service.duration;
                listBookingDetailsDto.push({
                    serviceId: service.id,
                    duration: service.duration,
                    packageId: null,
                    price: service.price,
                    startTime: startTime,
                    endTime: endTime
                });
                startTime = endTime;
            }
        }

        if (packageIds && packageIds.length > 0) {
            const packages: PackageEntity[] = await this.findPackageByIds(packageIds);
            for (const aPackage of packages) {
                for (const service of aPackage.services) {
                    let endTime = this.addMinutes(startTime, service.duration);
                    duration += service.duration;
                    listBookingDetailsDto.push({
                        serviceId: service.id,
                        duration: service.duration,
                        packageId: aPackage.id,
                        price: service.price,
                        startTime: startTime,
                        endTime: endTime
                    });
                    startTime = endTime;
                }
            }
        }

        // let bookingDetailsExist = await BookingDetailEntity.createQueryBuilder("bd")
        //     .leftJoin("bd.booking", "booking")
        //     .select(["bd.id", "bd.startTime", "bd.endTime"])
        //     .where("booking.storeId = :storeId", { storeId })
        //     .andWhere("booking.date = :date", { date: format(new Date(`${bodyBooking.date} ${startTime}`), "yyyy-MM-dd'T'HH:mm:ss.SSS") })
        //     .andWhere("bd.staffId = :staffId", { staffId: bodyBooking.staffId })
        //     .andWhere("bd.startTime >= :startTime", { startTime: bodyBooking.startTime })
        //     .getMany();

        // let convertBookingDetailsExist = bookingDetailsExist.map((bookingDetail) => ({ ...bookingDetail, endTime: this.addMinutes(bookingDetail.endTime, staff.breakTime) }))

        // let checkBookingSlotOverlaps = [];

        // for (const bookingDetailsDto of listBookingDetailsDto) {
        //     for (const bookingDetail of convertBookingDetailsExist) {
        //         if (this.overlapping(
        //             { start: bookingDetailsDto.startTime, end: bookingDetailsDto.endTime },
        //             { start: bookingDetail.startTime, end: bookingDetail.endTime }
        //         )) {
        //             checkBookingSlotOverlaps.push(bookingDetailsDto)
        //         }
        //     }
        // }

        // if (checkBookingSlotOverlaps.length > 0) {
        //     return;
        // }

        const booking = await BookingEntity.save(<BookingEntity><unknown>{
            customer, storeId, duration,
            date: new Date(`${this.convertYYYYMMDD(bodyBooking.date)} ${bodyBooking.startTime}:00`).toISOString(),
            status: bodyBooking.status,
            color: bodyBooking.color,
            note: bodyBooking.note,
        });

        let bookingDetails: BookingDetailEntity[] = [];

        for (const bookingDetail of listBookingDetailsDto) {
            bookingDetails.push(<BookingDetailEntity>{
                startTime: bookingDetail.startTime,
                endTime: bookingDetail.endTime,
                booking, staff,
                serviceId: bookingDetail.serviceId,
                packageId: bookingDetail.packageId,
                price: bookingDetail.price,
                duration: bookingDetail.duration,
            });
        }

        BookingDetailEntity.save(bookingDetails);

        return booking;
    }

    addMinutes(time: string, minutes: number): string {
        let hour = Number(time.split(":")[0]);
        let minute: string = time.split(":")[1];

        minute = (Number(minute) + minutes).toString();

        if (Number(minute) >= 60) {
            hour += 1;
            let _minute = Number(minute) - 60;
            if (_minute === 0) {
                minute = "00";
            } else if (_minute > 0 && _minute < 10) {
                minute = `0${_minute}`
            } else {
                minute = _minute.toString();
            }
        }

        return `${hour}:${minute}`;
    }

    async findPackageByIds(ids: number[]) {
        const packages = await PackageEntity.find({
            where: { id: In(ids) },
            relations: ["services"],
        });
        let listPackageConvert = [];
        for (const pac of packages) {
            for (const service of pac.services) {
                listPackageConvert.push({
                    serviceId: service.id,
                    price: pac.price,
                    duration: service.duration,
                    packageId: pac.id,
                });
            }
        }

        return listPackageConvert;
    }

    async findByBooking(id: number, storeId: number) {
        const booking = await BookingEntity.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.bookingDetails", "details")
            .leftJoinAndSelect("details.staff", "staff")
            .leftJoinAndSelect("details.service", "service")
            .leftJoinAndSelect("details.package", "package")
            .where("booking.id = :id and booking.storeId = :storeId", { id, storeId })
            .getOne();

        if (!booking) throw new NotFoundException("Not found booking with id = " + id);

        return booking;
    }

    getHistoryByCustomer(id: number, storeId: number) {
        return BookingEntity.find({ where: { storeId, customerId: id } });
    }

    async updateAppointment(bookingId: number, bodyUpdateBooking: UpdateBookingDto, storeId: number) {
        const serviceIds: number[] = bodyUpdateBooking.serviceIds;
        const packageIds: number[] = bodyUpdateBooking.packageIds;
        let booking = await this.findByBooking(bookingId, storeId);
        const bookingDetails = bodyUpdateBooking.bookingDetails;
        let startTime, duration = 0, bookingDetailIdsDeleted: number[];
        let listBookingDetailsDto: IListBookingDetail[] = [];
        const staff = await StaffEntity.findOne({ where: { id: bodyUpdateBooking.staffId } });

        for (const [i, bookingDetail] of bookingDetails.entries()) {
            if (bookingDetail.deleted) {
                bookingDetailIdsDeleted.push(bookingDetail.id);
            } else if (i === bookingDetails.length - 1) {
                startTime = bookingDetail.endTime;
            }
        }

        if (bookingDetailIdsDeleted.length > 0) {
            BookingDetailEntity.createQueryBuilder().delete().whereInIds(bookingDetailIdsDeleted).execute();
        }

        if (serviceIds && serviceIds.length > 0) {
            const services = await ServiceEntity.find({ where: { id: In(serviceIds) } });
            for (const service of services) {
                let endTime = this.addMinutes(startTime, service.duration);
                duration += service.duration;
                listBookingDetailsDto.push({
                    serviceId: service.id,
                    duration: service.duration,
                    packageId: null,
                    price: service.price,
                    startTime: startTime,
                    endTime: endTime
                });
                startTime = endTime;
            }
        }

        if (packageIds && packageIds.length > 0) {
            const packages: PackageEntity[] = await this.findPackageByIds(packageIds);
            for (const aPackage of packages) {
                for (const service of aPackage.services) {
                    let endTime = this.addMinutes(startTime, service.duration);
                    duration += service.duration;
                    listBookingDetailsDto.push({
                        serviceId: service.id,
                        duration: service.duration,
                        packageId: aPackage.id,
                        price: service.price,
                        startTime: startTime,
                        endTime: endTime
                    });
                    startTime = endTime;
                }
            }
        }

        let bookingDetailsExist = await BookingDetailEntity.createQueryBuilder("bd")
            .leftJoin("bd.booking", "booking")
            .select(["bd.id", "bd.startTime", "bd.endTime"])
            .where("booking.storeId = :storeId", { storeId })
            .andWhere("booking.date = :date", { date: booking })
            .andWhere("bd.staffId = :staffId", { staffId: bodyUpdateBooking.staffId })
            .andWhere("bd.startTime >= :startTime", { startTime })
            .getMany();

        let convertBookingDetailsExist = bookingDetailsExist.map((bookingDetail) => ({ ...bookingDetail, endTime: this.addMinutes(bookingDetail.endTime, staff.breakTime) }))

        let checkBookingSlotOverlaps = [];

        for (const bookingDetailsDto of listBookingDetailsDto) {
            for (const bookingDetail of convertBookingDetailsExist) {
                if (this.overlapping(
                    { start: bookingDetailsDto.startTime, end: bookingDetailsDto.endTime },
                    { start: bookingDetail.startTime, end: bookingDetail.endTime }
                )) {
                    checkBookingSlotOverlaps.push(bookingDetailsDto)
                }
            }
        }

        if (checkBookingSlotOverlaps.length > 0) {
            return;
        }

        let listBookingDetailNew: BookingDetailEntity[] = [];
        for (const bookingDetailsDto of listBookingDetailsDto) {
            listBookingDetailNew.push(<BookingDetailEntity>{
                startTime: bookingDetailsDto.startTime,
                endTime: bookingDetailsDto.endTime,
                booking, staff,
                serviceId: bookingDetailsDto.serviceId,
                packageId: bookingDetailsDto.packageId,
                price: bookingDetailsDto.price,
                duration: bookingDetailsDto.duration,
            });
        }

        BookingDetailEntity.save(listBookingDetailNew);

        return BookingEntity.save(<BookingEntity><unknown>{
            ...booking,
            date: format(new Date(bodyUpdateBooking.date), "yyyy-MM-dd"),
            status: bodyUpdateBooking.status,
            color: bodyUpdateBooking.color,
            note: bodyUpdateBooking.note,
        });
    }

    async cancelAppointment(id: number, booking: CancelBookingDto, userId: number) {
        const result = await BookingEntity.createQueryBuilder()
            .update({ status: booking.status })
            .where("id = :id ", { id })
            .execute();
        const user = await this.getUser(userId);
        let topic = user.email.replace(/[^\w\s]/gi, "");
        this.notifyService.sendhNotiTopic(topic, `Booking is ${booking.status}!`);
        return result;
    }

    async deleteAppointment(id: number, storeId: number, userId: number) {
        const deleteB = await BookingEntity.findOneBy({ id });
        if (deleteB.isActive === false) return deleteB;

        const user = await this.getUser(userId);
        let topic = user.email.replace(/[^\w\s]/gi, "");
        this.notifyService.sendhNotiTopic(topic, "Booking is deleted!");

        return BookingEntity.createQueryBuilder()
            .update({ isActive: false })
            .where("id = :id and storeId = :storeId", { id, storeId })
            .execute();
    }

    // ex: /appointment/booking/slots/?date=06-13-2021&timezone=America/Chicago&staffId=9
    async getBookingSlots(_query: QueryBookingSlotsDto, storeId: number) {
        const { date, timezone, staffId } = _query;
        const staff = await StaffEntity.findOne({ where: { id: staffId }, relations: ["workingHours", "timeOffs"], });

        if (!staff) throw new NotFoundException(`not found with id ${staffId}`);

        const setting = await SettingEntity.findOne({ where: { storeId }, relations: ["store"], });

        let stringToDate = new Date(`${this.convertDate(date)}` as string);
        stringToDate.setHours(0, 0, 0, 0);

        const getWorkingDay = staff.workingHours.find((w) => w.day === stringToDate.getDay());

        let workingStart = this.convertStringToTime(getWorkingDay.fromHour, stringToDate, setting.timeZone, `${timezone}` as string);
        let workingEnd = this.convertStringToTime(getWorkingDay.toHour, stringToDate, setting.timeZone, `${timezone}` as string);

        let availables: { time: Date; open: boolean }[] = this.getAllSlots(workingStart, workingEnd, setting.store.bookingSlotSize);

        const bookingDetails = await BookingDetailEntity.createQueryBuilder("bd")
            .leftJoin("bd.booking", "booking")
            .select(["bd.id", "bd.startTime", "bd.endTime", "booking.storeId", "booking.id", "booking.date", "booking.status"])
            .where("bd.staffId = :staffId AND booking.storeId = :storeId", { staffId, storeId, })
            .andWhere("booking.date between :workingStart and :workingEnd", { workingStart: workingStart.toISOString(), workingEnd: workingEnd.toISOString() })
            .getMany();

        for (let available of availables) {
            if (!getWorkingDay.open) available.open = false;
            if (
                bookingDetails.length > 0 &&
                bookingDetails.some((bd) => {
                    let _available = this.formatTime(available.time);
                    let day = format(bd.booking.date, "yyyy-MM-dd");

                    return (
                        this.compareTwoDateTime(_available) >= this.compareTwoDateTime(`${day} ${bd.startTime}:00`) &&
                        this.compareTwoDateTime(_available) < this.compareTwoDateTime(`${day} ${this.addMinutes(bd.endTime, staff.breakTime)}:00`)
                    );
                })
            ) {
                available.open = false;
            } else if (this.checkIfDayOff(staff.timeOffs, available.time)) {
                available.open = false;
            }
        }

        return availables;
    }

    compareTwoDateTime(date: Date | string): string {
        if (date) {
            return format(new Date(date), "hh:mm:ss a");
        }
        if (this.typeOf(date) === "String") {
            return format(new Date(date), "hh:mm:ss a");
        }
        return "";
    }

    typeOf(value): string {
        return Object.prototype.toString.call(value).slice(8, -1);
    }

    checkIfDayOff(timeOffs: TimeOffEntity[], pickedDate: Date) {
        for (const timeOff of timeOffs) {
            if (format(pickedDate, "yyyy-MM-dd") === format(timeOff.startDate, "yyyy-MM-dd")) {
                if (
                    Date.parse(format(pickedDate, "yyyy-MM-dd hh:mm:ss a")) >= Date.parse(format(timeOff.startDate, "yyyy-MM-dd hh:mm:ss a")) &&
                    Date.parse(format(pickedDate, "yyyy-MM-dd hh:mm:ss a")) < Date.parse(format(timeOff.endDate, "yyyy-MM-dd hh:mm:ss a"))
                ) {
                    return true
                }
            } else {
                return false
            }
        }
        return false;
    }

    convertDate(day: string) {
        const [dd, MM, YYYY] = day.split("/");
        return `${MM}-${dd}-${YYYY}`;
    }

    convertYYYYMMDD(date: string){
        const [dd, MM, YYYY] = date.split("/");
        return `${YYYY}-${MM}-${dd}`;
    }

    formatTime(date: Date) {
        return format(date, "yyyy-MM-dd hh:mm:ss a");
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

    overlapping(a: ITimeOverlap, b: ITimeOverlap) {
        const getMinutes = s => {
            const p = s.split(':').map(Number);
            return p[0] * 60 + p[1];
        };
        return getMinutes(a.end) > getMinutes(b.start) && getMinutes(b.end) > getMinutes(a.start);
    };

    convertStringToTime(time: string, pickDate: Date, storeTimezone: string, customerTimezone: string = "") {
        const [hh, mm] = time.split(":");
        //change timezone to store timezone
        let result = this.changeTimezone(pickDate, storeTimezone);
        result.setHours(+hh, +mm);
        //change timezone customer timezone
        if (customerTimezone) {
            result = this.changeTimezone(result, customerTimezone);
        }
        return result;
    }

    changeTimezone(date: Date, ianatz: string) {
        // suppose the date is 12:00 UTC
        // var invdate = new Date(date.toLocaleString('en-US', { timeZone: ianatz }));
        var invdate = new Date(date);

        // then invdate will be 07:00 in Toronto
        // and the diff is 5 hours
        var diff = date.getTime() - invdate.getTime();

        // so 12:00 in Toronto is 17:00 UTC
        return new Date(date.getTime() + diff);
    }

    getUser(userId: number) {
        return UserEntity.findOne({ where: { id: userId } });
    }

    getStaffsByService(serviceId: number, staffId: number, storeId: number) {
        let query;

        if (serviceId) {
            query = StaffEntity.createQueryBuilder("staff")
                .leftJoin("staff.services", "services")
                .where("staff.storeId = :storeId", { storeId })
                .andWhere("services.id = :serviceId", { serviceId })
        }
        if (staffId) {
            query = ServiceEntity.createQueryBuilder('service')
                .leftJoin("service.staffs", "staffs")
                .where("staffs.storeId = :storeId", { storeId })
                .andWhere("staffs.id = :staffId", { staffId })
        }

        return query.getMany();
    }

    async updateDragBookingDetail(bookingId: number, body: DrapBookingDetailDto, storeId: number) {
        const endTime = this.addMinutes(body.startTime, body.duration);

        let bookingDetail = await BookingDetailEntity.createQueryBuilder('bd')
            .leftJoin("bd.booking", "booking")
            .leftJoin("bd.service", "service")
            .addSelect(["service.id", "service.name", "service.duration"])
            .where("booking.id = :id AND booking.storeId = :storeId", { id: bookingId, storeId })
            .andWhere("bd.id = :id AND bd.staffId = :staffId ", { id: body.id, staffId: body.staffId })
            .andWhere("bd.startTime >= :startTime", { startTime: body.startTime })
            .getOne();

        if (!bookingDetail) throw new NotFoundException("Not found Booking Detail!");
        const staff = await StaffEntity.findOne({ where: { id: body.staffId, storeId } });

        let checkTimeBookingDetailsExist = await BookingDetailEntity.createQueryBuilder('bd')
            .leftJoin("bd.booking", "booking")
            .leftJoin("bd.service", "service")
            .select(["bd.id", "bd.startTime", "bd.endTime"])
            .andWhere("bd.staffId = :staffId ", { staffId: body.staffId })
            .andWhere("bd.startTime >= :startTime", { startTime: body.startTime })
            .getMany();

        let checkBookingSlotOverlaps = [];

        for (const bookingDetail of checkTimeBookingDetailsExist) {
            if (this.overlapping(
                { start: body.startTime, end: endTime },
                { start: bookingDetail.startTime, end: bookingDetail.endTime }
            )) {
                checkBookingSlotOverlaps.push({ start: bookingDetail.startTime, end: bookingDetail.endTime });
            }
        }

        if (checkBookingSlotOverlaps.length > 0) {
            return;
        }

        return BookingDetailEntity.save(<BookingDetailEntity>{ ...bookingDetail, staff, startTime: body.startTime, endTime })
    }
}