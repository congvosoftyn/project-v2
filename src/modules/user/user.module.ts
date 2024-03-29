import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/User.entity';
import { StoreEntity } from 'src/entities/Store.entity';
import { EmailModule } from '../email/email.module';
import { RedisCacheModule } from '../cache/redisCache.module';
import { UserGateway } from './user.gateway';
import { NotifyModule } from '../notify/notify.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, StoreEntity]),
    EmailModule,
    RedisCacheModule,
    NotifyModule
  ],
  providers: [UserService, UserGateway],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
