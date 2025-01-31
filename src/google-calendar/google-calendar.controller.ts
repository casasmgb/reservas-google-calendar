import { Controller, Get, Post, Query } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';

@Controller('calendar')
export class GoogleCalendarController {
  constructor(private readonly calendarService: GoogleCalendarService) { }

  @Get('availability')
  async getAvailability(@Query('date') date: string) {
    return this.calendarService.getAvailability(date);
  }

  @Get('reserve')
  async createEvent(
    @Query('date') date: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('name') name: string,
  ) {
    if (!startTime) {
      return { error: 'La hora de inicio es obligatorio' };
    }
    if (!endTime) {
      return { error: 'La hora de finalizacion es obligatorio' };
    }
    if (!name) {
      return { error: 'El nombre es obligatorio' };
    }

    return this.calendarService.createEvent(date, startTime, endTime, name);
  }
}
