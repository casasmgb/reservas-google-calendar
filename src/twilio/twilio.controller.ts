import { Controller, Post, Body, Req } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('whatsapp')
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('incoming')
  async handleIncomingMessage(@Body() body: any, @Req() req: any): Promise<void> {
    const from = body.From;
    const message = body.Body;

    // Llamar al servicio para manejar el mensaje entrante
    await this.twilioService.handleIncomingMessage(from, message);
  }
}
