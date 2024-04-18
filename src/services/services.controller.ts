// service.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesDto } from 'src/services/dto/services.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() serviceDto: ServicesDto) {
    return this.servicesService.create(serviceDto);
  }

  @Get()
  async findAll(): Promise<ServicesDto[]> {
    return this.servicesService.findAll();
  }


}
