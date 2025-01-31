import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleCalendarModule } from './google-calendar/google-calendar.module';

@Module({
  imports: [GoogleCalendarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
