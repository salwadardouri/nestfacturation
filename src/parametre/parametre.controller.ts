import { Body, Controller, Get, Param, Post, Put, Query , HttpException, HttpStatus  } from '@nestjs/common';
import { ParametreDto } from './dto/parametre.dto';
import { ParametreService } from './parametre.service';

@Controller('parametre')
export class ParametreController {
  constructor(private readonly service: ParametreService) {}

  @Post()
  async create(@Body() parametreDto: ParametreDto) {
    try {
      const result = await this.service.create(parametreDto);
      return { success: true, message: 'Parametre created successfully', data: result };
    } catch (error) {
      if (error.response && error.response.statusCode === HttpStatus.BAD_REQUEST) {
        throw new HttpException(error.response.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Email already exists, please enter another email', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Get() // Définition de la route GET pour obtenir tous les paramètres
  async findAll() {
    return this.service.FindAll();
  }

  @Get('/:id') // Définition de la route GET pour obtenir un paramètre par son ID
  async findOne(@Param('id') id: string) {
    return this.service.FindOne(id);
  }

  @Put('/:id') // Définition de la route PUT pour mettre à jour un paramètre par son ID
  async update(@Param('id') id: string, @Body() parametreDto: ParametreDto) {
    return this.service.Update(id, parametreDto);
  }

  @Post('/search') // Définition de la route POST pour rechercher des paramètres
  async search(@Query('key') key: string) {
    return this.service.Search(key);
  }
}
