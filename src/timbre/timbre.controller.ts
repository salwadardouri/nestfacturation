import { Controller, Post, Body, Get,ConflictException } from '@nestjs/common';
import { TimbreService } from './timbre.service';
import { TimbreDto } from './dto/timbre.dto';

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
    
}
