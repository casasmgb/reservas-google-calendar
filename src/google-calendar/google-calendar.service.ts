import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as moment from 'moment-timezone';

dotenv.config();

@Injectable()
export class GoogleCalendarService {
  private calendar;
  private timeZone = 'America/La_Paz';

  constructor() {
    const credentialsEnv = process.env.GOOGLE_CALENDAR_CREDENTIALS;
    if (!credentialsEnv) {
      throw new Error('La variable de entorno GOOGLE_CALENDAR_CREDENTIALS no está definida');
    }
    const credentials = JSON.parse(credentialsEnv);

    // Inicializamos la autenticación con Google usando las credenciales obtenidas
    const auth = new google.auth.GoogleAuth({
      // keyFile: process.env.GOOGLE_CALENDAR_CREDENTIALS,
      credentials,  // Usamos el objeto obtenido por JSON.parse()
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({ version: 'v3', auth });
  }

  // Consulta disponibilidad de una fecha
  async getAvailability(date: string) {
    const events = await this.calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date(`${date}T00:00:00-05:00`).toISOString(),
      timeMax: new Date(`${date}T23:59:59-05:00`).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return events.data.items.map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
    }));
  }

  // Genera un código de 6 dígitos
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Crea una reserva en Google Calendar
  async createEvent(date: string, startTime: string, endTime: string, name: string) {
    const confirmationCode = this.generateCode();

    // Convertimos las fechas correctamente a UTC respetando la zona horaria
    const startDateTime = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm', this.timeZone).utc().format();
    const endDateTime = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm', this.timeZone).utc().format();

    // Obtener todas las reservas de ese día
    const events = await this.calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startDateTime,
      timeMax: endDateTime,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const reservations = events.data.items || [];

    // Revisar si alguna cancha está disponible
    const reservedCanchaA = reservations.some(event => event.summary?.includes('Cancha Azul'));
    const reservedCanchaB = reservations.some(event => event.summary?.includes('Cancha Roja'));

    let assignedCancha: string | null = null;
    let colorId: string | null = null;

    if (!reservedCanchaA) {
      assignedCancha = 'Cancha Azul';
      colorId = '7'; 
    } else if (!reservedCanchaB) {
      assignedCancha = 'Cancha Roja';
      colorId = '11';
    } else {
      return { error: 'No hay disponibilidad en ninguna cancha para este horario' };
    }

    // Crear la reserva con la cancha asignada y color
    const event = await this.calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        summary: `Reserva para ${name} (Código: ${confirmationCode}) - ${assignedCancha}`,
        description: `Código de confirmación: ${confirmationCode}\nCancha asignada: ${assignedCancha}`,
        start: { dateTime: startDateTime, timeZone: this.timeZone },
        end: { dateTime: endDateTime, timeZone: this.timeZone },
        colorId: colorId,
      },
    });

    return {
      message: 'Reserva creada',
      cancha: assignedCancha,
      color: colorId === '1' ? 'Rojo' : 'Azul',
      code: confirmationCode,
      eventId: event.data.id,
    };
  }
}
