// service.controller.ts
import { Controller, Post,Put, Body, Patch,BadRequestException,Get,Delete ,Query,NotFoundException,HttpException,HttpStatus,Param} from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesDto } from 'src/services/dto/services.dto';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { SearchDTO } from './dto/search.dto';
import { UpdateDto } from './dto/update.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly Service: ServicesService) {}

  
  @Post()
  async create(@Body() serviceDto: ServicesDto) {
    return this.Service.create(serviceDto);
  }
  @Get()
  async findAll(): Promise<ServicesDto[]> {
    return this.Service.findAll();
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedService = await this.Service.delete(id);
      if (!deletedService) {
        throw new NotFoundException(`Service not found`);
      }
      return { message: 'Service deleted successfully' };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id') 
  async updateService(
    @Param('id') id: string, 
    @Body() UpdateDto: UpdateDto,
  ): Promise<Service> {
    const updatedService = await this.Service.updateService(id,UpdateDto); // Appelle le service pour mettre à jour
    if (!updatedService) {
      throw new NotFoundException('Service not found');
    }
    return updatedService;
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
  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return this.Service.getServiceById(id);
  }
}
