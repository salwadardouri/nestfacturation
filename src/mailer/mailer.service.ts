import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  async sendMail(to: string, subject: string, text: string) {
    const transporter = createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get('EMAIL'),
        pass: this.configService.get('CODE'),
      },
    });

    const mailOptions = {
      from: this.configService.get('EMAIL'),
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
  }
}
