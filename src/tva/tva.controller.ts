import { Controller, Post, Body, Get,ConflictException } from '@nestjs/common';
import { TvaService } from './tva.service';
import { TvaDto } from './dto/tva.dto';

@Controller('tva')
export class TvaController {
    constructor(private readonly Service: TvaService) {}
    @Post()
    async create(@Body() tvaDto: TvaDto) {
      try {
        return this.Service.create(tvaDto);
      } catch (error) {
        if (error instanceof ConflictException) {
          throw new ConflictException(error.message);
        }
        throw error;
      }
    }
    @Get()
    async findAll(): Promise<TvaDto[]> {
      return this.Service.findAll();
    }
    
}
