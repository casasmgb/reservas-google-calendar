import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleCalendarController } from './google-calendar.controller';

@Module({
  providers: [GoogleCalendarService],
  controllers: [GoogleCalendarController]
})
export class GoogleCalendarModule {}
