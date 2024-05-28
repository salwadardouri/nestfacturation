import {Controller,Get,Post,Body,Param,Patch,Res, Delete,HttpStatus, HttpCode,NotFoundException, HttpException,Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response,Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateClientDto } from './dto/updateclient.dto';
import { extname } from 'path';
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
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: 'C:/Users/HP/Desktop/visto/Nouveau dossier/myapp/uploads/logos', // Chemin de stockage des logos
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedMIMETypes = ['image/jpeg', 'image/png'];
      if (!allowedMIMETypes.includes(file.mimetype)) {
        return callback(new Error('Only JPEG and PNG files are allowed'), false);
      }
      callback(null, true);
    },
  }))
  async createAccount(@Body() clientDto: ClientDto, @UploadedFile() logo: Express.Multer.File, @Res() res: Response): Promise<{ user: Client; resetLink: string; message: string }> {

    try {
      clientDto.logo = logo ? `C:/Users/HP/Desktop/visto/Nouveau dossier/myapp/uploads/logos/${logo.filename}` : ''; 
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
  @Delete(':id')
  @HttpCode(HttpStatus.OK) //pour message d'erreur
  async deleteClient(@Param('id') clientId: string): Promise<{ message: string }> {
    try {
      await this.service.deleteClient(clientId);
      return { message: 'Client deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @Get()
  async getClients(): Promise<Client[]> {
    return this.service.getClients();
  }

  @Get('/:id')
  FindOne(@Param('id') id: string) {
    return this.service.FindOne(id);
  }

  @Patch(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto
  ) {
    return await this.service.updateClient(id, updateClientDto);
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

