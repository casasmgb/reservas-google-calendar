import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  // Enviar mensaje de WhatsApp
  async sendMessage(to: string, body: string): Promise<void> {
    await this.client.messages.create({
      body: body,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
    });
  }

  // Responder a un mensaje de WhatsApp (usando Twilio)
  async handleIncomingMessage(from: string, body: string): Promise<void> {
    const reply = this.getReply(body); // Lógica para determinar la respuesta

    // Enviar la respuesta al usuario de WhatsApp
    await this.sendMessage(from, reply);
  }

  private getReply(body: string): string {
    // Aquí puedes agregar la lógica para interpretar el mensaje entrante
    if (body.toLowerCase().includes('disponibilidad')) {
      return 'Las canchas están disponibles de 8 a 18 horas, ¿qué hora te gustaría reservar?';
    }

    return 'Gracias por tu mensaje, por favor escribe "disponibilidad" para ver las horas disponibles.';
  }
}
