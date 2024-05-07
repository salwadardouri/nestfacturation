import { Controller, Post, Query,Body, Get,ConflictException,Put ,Param,Delete,HttpException,NotFoundException,HttpStatus} from '@nestjs/common';
import { TimbreService } from './timbre.service';
import { TimbreDto } from './dto/timbre.dto';
import { Timbre} from 'src/schemas/timbre.schema';
import { SearchDTO } from './dto/search.dto';
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
          throw new NotFoundException(`TVA with ID ${id} not found`);
        }
        return { message: 'TVA deleted successfully' };
      } catch (error) {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
  @Put(':id')
  async update(@Param('id') id: string, @Body() timbreDto: TimbreDto): Promise<Timbre> {
    return await this.Service.update(id, timbreDto);
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
  

    
}
