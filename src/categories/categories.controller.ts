// categories.controller.ts
import { Controller, Post, Body,Query, Get,ConflictException,Param,Put,Delete,NotFoundException ,HttpStatus,HttpException} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Categories } from 'src/schemas/categories.schema';
import { SearchDTO } from './dto/search.dto';

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
  @Put(':id')
  async update(@Param('id') id: string, @Body() CategoryDto: CreateCategoryDto): Promise<Categories> {
    return await this.Service.update(id, CategoryDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedCategory = await this.Service.delete(id);
      if (!deletedCategory) {
        throw new NotFoundException(`Category not found`);
      }
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
