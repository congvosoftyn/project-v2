import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesModule } from './modules/modules.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppGateway } from './app.gateway';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FirebaseModule } from 'nestjs-firebase';
import { ServiceAccount } from 'firebase-admin';
import { FCM } from './config';
import { ApolloServerPluginLandingPageLocalDefault, AuthenticationError } from 'apollo-server-core';
import GraphQLJSON from 'graphql-type-json';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/utils/logging.interceptor';
import { NotifyModule } from './modules/notify/notify.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: +process.env.DB_PORT || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'admin123',
      database: process.env.DB_NAME || 'charmsta',
      charset: 'utf8mb4',
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    ModulesModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      installSubscriptionHandlers: true,
      subscriptions: {
        "subscriptions-transport-ws": {
          onConnect: (connectionParams: any) => {
            const authToken: string = ('authorization' in connectionParams) && connectionParams.authorization.split(' ')[1];
            if (authToken) {
              return { req: { headers: connectionParams } }
            }
            throw new AuthenticationError('authToken must be provided');
          }
        },
      },
      resolvers: { JSON: GraphQLJSON },
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential: FCM as ServiceAccount,
    }),
    NotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionsLoggerFilter
    // }
  ]
})
export class AppModule { }
