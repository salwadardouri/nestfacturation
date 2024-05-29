import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  ConflictException,
  HttpException,
  HttpStatus,
  Query,
  Put,
  Delete,
  Param,NotFoundException
} from '@nestjs/common';
import { TvaService } from './tva.service';
import { TvaDto } from './dto/tva.dto';
import { Tva } from 'src/schemas/tva.schema';
import { SearchDTO } from './dto/search.dto';
import { ActivatedTvaDto } from './dto/activatedTva.dto';
@Controller('tva')
export class TvaController {
  constructor(private readonly tvaService: TvaService) {}

  @Post()
  async create(@Body() tvaDto: TvaDto) {
    try {
      const createdTva = await this.tvaService.create(tvaDto);
      return createdTva;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Duplicate TVA entry');
      }
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Tva[]> {
    return this.tvaService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() tvaDto: TvaDto): Promise<Tva> {
    return await this.tvaService.update(id, tvaDto);
  }
  

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedTva = await this.tvaService.delete(id);
      if (!deletedTva) {
        throw new NotFoundException(`TVA with ID ${id} not found`);
      }
      return { message: 'TVA deleted successfully' };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Patch('activated/:id')
  async activatedTva(
    @Param('id') id: string,
    @Body() activatedTvaDto: ActivatedTvaDto
  ) {
    return await this.tvaService.activatedTva(id, activatedTvaDto);
  }

  // @Get('search') // Recherche par titre ou pourcentage
  // async search(
  //   @Query('title') title?: string,
  //   @Query('percent') percent?: string,
  // ): Promise<Tva[]> {
  //   return this.tvaService.search({ title, percent });
  // }
  @Post('/search')
  async Search(@Query() searchDto: SearchDTO) {
    try {
      return await this.tvaService.Search(searchDto.key);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      }, HttpStatus.NOT_FOUND);
    }
  }
}
