// categories.controller.ts
import { Controller, Post, Body, Get,ConflictException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly Service: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return this.Service.create(createCategoryDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
  @Get()
  async findAll(): Promise<CreateCategoryDto[]> {
    return this.Service.findAll();
  }
  
}
