import { Controller, Post, Patch,Query,Body, Get,ConflictException,Put ,Param,Delete,HttpException,NotFoundException,HttpStatus} from '@nestjs/common';
import { TimbreService } from './timbre.service';
import { TimbreDto } from './dto/timbre.dto';
import { Timbre} from 'src/schemas/timbre.schema';
import { SearchDTO } from './dto/search.dto';
import { ActivatedTimbreDto } from './dto/activatedTimbre.dto';
@Controller('timbre')
export class TimbreController {
    constructor(private readonly Service: TimbreService) {}
    @Post()
    async create(@Body() TimbreDto: TimbreDto) {
      try {
        return this.Service.create(TimbreDto);
      } catch (error) {
        if (error instanceof ConflictException) {
          throw new ConflictException(error.message);
        }
        throw error;
      }
    }
    @Get()
    async findAll(): Promise<TimbreDto[]> {
      return this.Service.findAll();
    }
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string }> {
      try {
        const deletedTimbre = await this.Service.delete(id);
        if (!deletedTimbre) {
          throw new NotFoundException(`Timbre not found`);
        }
        return { message: 'Timbre deleted successfully' };
      } catch (error) {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    @Put(':id') // Point de terminaison de mise à jour
    async update(
      @Param('id') id: string, // ID du service à mettre à jour
      @Body() TimbreDto: TimbreDto, // Données de mise à jour
    ): Promise<Timbre> {
      const updatedTimbre = await this.Service.update(id,TimbreDto); // Appelle le service pour mettre à jour
      if (!updatedTimbre) {
        throw new NotFoundException('Service not found');
      }
      return updatedTimbre;
    }
  @Post('/search')
  async Search(@Query() searchDto: SearchDTO) {
    try {
      return await this.Service.Search(searchDto.key);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: error.message,
      }, HttpStatus.NOT_FOUND);
    }
  }
  
  @Patch('activated/:id')
  async activatedTimbre(
    @Param('id') id: string,
    @Body() activatedTimbreDto: ActivatedTimbreDto
  ) {
    return await this.Service.activatedTimbre(id, activatedTimbreDto);
  }
    
}
