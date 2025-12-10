import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleCalendarModule } from './google-calendar/google-calendar.module';
import { TwilioModule } from './twilio/twilio.module';

@Module({
  imports: [GoogleCalendarModule, TwilioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
