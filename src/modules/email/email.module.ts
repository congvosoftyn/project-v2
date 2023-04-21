import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USER } from 'src/config';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: EMAIL_SERVICE,
        host: 'smtp.gmail.com',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        }
      },

      defaults: {
        from: `"No Reply" <${EMAIL_USER}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: join(__dirname, 'templates', 'partials'),
          options: {
            strict: true,
          },
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
