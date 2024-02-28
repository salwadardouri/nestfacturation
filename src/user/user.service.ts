import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';

import { SignUpDto  } from 'src/auth/dto/signup.dto';
import { CreateUserDto } from './dto/createuser.dto';
import { hashSync } from 'bcryptjs';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UserService {
    
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}


  async comptable(createUserDto: CreateUserDto) {
    const password = this.generatePassword();
    const hashedPassword = hashSync(password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await user.save();
    await this.mailerService.sendMail(
      createUserDto.email,
      'Nouveau mot de passe',
      `Votre nouveau mot de passe est : ${password}`,
    );
    return user;
  }

  private generatePassword(length: number = 8): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // async createUser(userDto: any) {
  //   const { password, email, ...rest } = userDto;
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const newUser = new this.userModel({ ...rest, password: hashedPassword });
  //   await newUser.save();

  //   await this.mailService.sendEmail(
  //     email,
  //     'Welcome to My App',
  //     'welcome-email', // Create a template for your welcome email
  //     { fullname: rest.fullname },
  //   );
  // }
    // async createUserAndSendPassword(userDto: {
    //   fullname: string;
    //   email: string;
    //   country: string;
    //   num_phone: string;
    //   address: string;
    //   code_postal: string;
    //   roles: string[];
    // }): Promise<void> {
    //   const password = this.generateRandomPassword();
    //   const hashedPassword = await bcrypt.hash(password, 10);
  
    //   const user = await this.userModel.create({
    //     ...userDto,
    //     password: hashedPassword,
    //   });
  
    //   await this.mailService.sendPasswordEmail(user.email, password);
    // }
  
    // private generateRandomPassword(): string {
    //   // Générez un mot de passe aléatoire selon vos besoins
    //   return 'generatedPassword';
    // }
}
