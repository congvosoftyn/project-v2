import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  //@ts-ignore
  if (typeof (PhusionPassenger) != 'undefined') {
    //@ts-ignore
    PhusionPassenger.configure({ autoInstall: false });
  }
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    exposedHeaders: ['Content-Length', 'token']
  });
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false
  }));
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  const options = new DocumentBuilder()
    .setTitle('Appoinment API')
    .setDescription('API for appoinment')
    .setVersion('1.0')
    .addBearerAuth({
      description: `[just text field] Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http', // I`ve attempted type: 'apiKey' too
      in: 'HeaderAC',
      bearerFormat: 'JWT',
    },
      'access-token'
    ).addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
        bearerFormat: 'JWT'
      },
      'customer-token'
    )
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        scheme: 'Bearer',
        type: 'http', // I`ve attempted type: 'apiKey' too
        in: 'Header',
        bearerFormat: 'JWT'
      },
      'no-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  //@ts-ignore
  if (typeof (PhusionPassenger) != 'undefined') {
    await app.listen('passenger');
  } else {
    await app.listen(3000);
  }

}
bootstrap();
