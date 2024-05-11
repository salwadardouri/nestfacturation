import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailerService {
  
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('CODE'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL'), // It's good practice to specify the type expected from configService.get
      to: to,
      subject: subject,
      text: text,
    };
    
    try {
      await this.transporter.sendMail(mailOptions).then(()=> {
        console.error('Email sent successfully');
      }).catch((error) => {
        console.log('Mail not found', error.message);
        throw new Error('Failed to send email'); // Optionally re-throw or handle error differently 
      })
      
    } catch (error) {
      console.log(error.message);
      
    }
    
  
  }
  
  async sendResetPasswordCode(email: string, code: string): Promise<void> {
    const subject = 'Réinitialisation de mot de passe';
    const text = `Votre code de réinitialisation de mot de passe est : ${code}`;
    await this.sendMail(email, subject, text);
  }


  async sendResetPasswordLink(email: string, resetToken: string): Promise<string> {
    const resetLink = `http://localhost:3000/create-passwordfin/${resetToken}`;
    const subject = 'Réinitialisation de mot de passe';
    const text = `Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`;
    await this.sendMail(email, subject, text);
    return resetLink;
  }

}