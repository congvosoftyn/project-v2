import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { SettingEntity } from "./Setting.entity";
import { OpenHourEntity } from "./OpenHour.entity";
import { UserEntity } from "./User.entity";

@Entity('store')
export class StoreEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    categories: string;

    @Column()
    phoneNumber: string;

    @Column()
    email: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column()
    zipcode: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    image: string;

    @OneToOne(type => SettingEntity, setting => setting.store, { cascade: ["update", "insert", "remove"] })
    setting: SettingEntity;

    @OneToMany(type => OpenHourEntity, openHour => openHour.store, { cascade: ["update", "insert", "remove"] })
    openHours: OpenHourEntity[];

    @Column({ default: 'America/Chicago' })
    timezone: string;

    @Column({ default: 15 })
    bookingSlotSize: number;

    @Column({ nullable: true })
    notes: string;

    @Column({ nullable: true })
    cancelTime: number;

    @ManyToOne(()=>UserEntity, {onDelete:"CASCADE",onUpdate:"CASCADE"})
    @JoinColumn({name:"userId"})
    user: UserEntity;

    @Column()
    userId: number;
}