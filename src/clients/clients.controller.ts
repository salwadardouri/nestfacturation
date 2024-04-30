
import {Controller,Get,Post,Body,Param,Put,Res, HttpStatus, NotFoundException, HttpException,Query,} from '@nestjs/common';
import { Response } from 'express';
import { ClientsService } from './clients.service';
import { Client } from 'src/schemas/clients.schema';
import { ClientDto  } from './dto/clients.dto';
import { SearchDTO } from 'src/clients/dto/search.dto';
@Controller('clients')
export class ClientsController {
    constructor(private readonly service: ClientsService) {}


    
  //  @Post('signupclient')
  // async signUpClient(@Body() clientDto: ClientDto, @Res() res: Response): Promise<void> {
  //   try {
  //     const { user } = await this.service.signUpClient(clientDto);
  //     res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user });
  //   } catch (error) {
  //     if (error.status === HttpStatus.CONFLICT) {
  //       res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
  //     } else {
  //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  //     }
  //   }
  // }
  @Post('create-account')
  async createAccount(@Body() clientDto: ClientDto, @Res() res: Response): Promise<{ user: Client; resetLink: string; message: string }> {
    try {
      const { user, resetLink, message } = await this.service.createAccount(clientDto);
      res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user });
      return { user, resetLink, message };
    } catch (error) {
      if (error.status === HttpStatus.CONFLICT) {
        res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
    }
  }
  @Post('create-password/:token')
  async resetPassword(@Param('token') token: string, @Body('newPassword') newPassword: string) {
   
      const email = await this.service.getEmailFromToken(token);
      if (!email) {
        throw new NotFoundException('Token invalide ou expiré.');
      }

      await this.service.resetPassword(email, newPassword);
      return { message: 'Password create successfully' };
    
  }
  @Get()
  async getClients(): Promise<Client[]> {
    return this.service.getClients();
  }

  @Get('/:id')
  FindOne(@Param('id') id: string) {
    return this.service.FindOne(id);
  }
  @Put('/:id')
  Update(@Param('id') id: string, @Body() body: ClientDto) {
    return this.service.Update(id, body);
  }
    

  @Post('/search')
  async Search(@Query() searchDto: SearchDTO) {
    try {
      return await this.service.Search(searchDto.key);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      }, HttpStatus.NOT_FOUND);
    }
  }
}

