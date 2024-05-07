import { Controller, Post, Body, BadRequestException,Get } from '@nestjs/common';
import { UserService } from './user.service';

import { User} from '../schemas/user.schema';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
  
    // @Post('signup')
  // async signUp(@Body() createUserDto: CreateUserDto): Promise<{ message: string }> {
  //   try {
  //     await this.userService.createUser(createUserDto);
  //     return { message: 'Inscription réussie.' };
  //   } catch (error) {
  //     throw new BadRequestException(`Erreur lors de l'inscription : ${error.message}`);
  //   }
  // }
  // @Post('sendemail')
  // async comptable(@Body() mailDto: MailDto) {
  //   return await this.userService.comptable(mailDto);
  // }
}
