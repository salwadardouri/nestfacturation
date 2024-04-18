import { Injectable, BadRequestException  } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';

import * as bcrypt from 'bcryptjs';

import { SignUpDto  } from 'src/auth/dto/signup.dto';
 import { CreateUserDto } from './dto/createuser.dto';
import { hashSync } from 'bcryptjs';
import { MailerService } from 'src/mailer/mailer.service';
import { MailDto } from './dto/mail.dto';

@Injectable()
export class UserService {
    
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,

    private readonly mailerService: MailerService,
  ) {}
  
async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }


  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const { fullname, email, password, country, num_phone, address, code_postal, roles } = createUserDto;

  //   // Vérifier si l'utilisateur existe déjà avec l'email fourni
  //   const existingUser = await this.userModel.findOne({ email });
  //   if (existingUser) {
  //     throw new BadRequestException('Cet utilisateur existe déjà.');
  //   }

  //   // Hachage du mot de passe
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   // Création de l'utilisateur
  //   const newUser = new this.userModel({
  //     fullname,
  //     email,
  //     password: hashedPassword,
  //     country,
  //     num_phone,
  //     address,
  //     code_postal,
  //     roles
  //   });

  //   return await newUser.save();
  // }
  // async comptable(mailDto: MailDto) {
  //   const password = this.generatePassword();
  //   const hashedPassword = hashSync(password, 10);
  //   const user = new this.userModel({
  //     ...mailDto,
  //     password: hashedPassword,
  //   });
  //   await user.save();
  //   await this.mailerService.sendMail(
  //     mailDto.email,
  //     'Nouveau mot de passe',
  //     `Votre nouveau mot de passe est : ${password}`,
  //   );
  //   return user;
  // }

  // private generatePassword(length: number = 8): string {
  //   const chars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let password = '';
  //   for (let i = 0; i < length; i++) {
  //     password += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return password;
  // }

 
}
