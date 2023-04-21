import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from 'typeorm';
import crypto = require('crypto');
import { Length, IsEmail } from 'class-validator';

@Entity('user')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Length(4, 1000)
  password: string;

  @Column({ default: true })
  isActive: boolean;

  hashPassword() {
    const salt = crypto.randomBytes(32).toString('hex');
    const password_hash = crypto.createHash('sha256').update(salt + this.password).digest('hex');
    this.password = salt + password_hash;
    return this.password;
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    const salt = this.password.substring(0, 64);
    const hash = this.password.substring(64);
    const password_hash = crypto.createHash('sha256').update(salt + unencryptedPassword).digest('hex');
    return hash === password_hash;
  }

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  appleId: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  topicNoti: string;

  @Column()
  phoneNumber: string;
}
