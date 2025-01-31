import { Controller, Get, Post, Query } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';

@Controller('calendar')
export class GoogleCalendarController {
  constructor(private readonly calendarService: GoogleCalendarService) {}

  @Get('availability')
  async getAvailability(@Query('date') date: string) {
    return this.calendarService.getAvailability(date);
  }

  @Post('reserve')
  async createEvent(
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('name') name: string,
  ) {
    if (!name) {
      return { error: 'El nombre es obligatorio' };
    }

    return this.calendarService.createEvent(date, startTime, endTime, name);
  }
}
