import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createuser.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Post('sendemail')
  async comptable(@Body() createUserDto: CreateUserDto) {
    return await this.userService.comptable(createUserDto);
  }
}
