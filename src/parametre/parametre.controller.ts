import { Body, Controller, Get, Param, Post, Put, Query , HttpException, HttpStatus , NotFoundException, Delete } from '@nestjs/common';
import { ParametreDto } from './dto/parametre.dto';
import { ParametreService } from './parametre.service';
import { Parametre } from 'src/schemas/parametre.schema';
import { SearchDTO } from './dto/search.dto';

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
  @Put(':id')
  async update(@Param('id') id: string, @Body() parametreDto: ParametreDto): Promise<Parametre> {
    return await this.service.update(id,parametreDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedParametre = await this.service.delete(id);
      if (!deletedParametre) {
        throw new NotFoundException(`Parametre not found`);
      }
      return { message: 'Parametre deleted successfully' };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/search') // Définition de la route POST pour rechercher des paramètres
  async search(@Query('key') key: string) {
    return this.service.Search(key);
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
