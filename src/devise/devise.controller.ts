import {
    Controller,
    Post,
    Body,
    Get,
    ConflictException,
    HttpException,
    HttpStatus,
    Query,
    Put,
    Delete,
    Param,
    NotFoundException,
    Patch
  } from '@nestjs/common';
  import { DeviseService } from './devise.service';
  import { DeviseDto } from './dto/devise.dto';
  import { Devise } from 'src/schemas/devise.schema';
  import { SearchDTO } from './dto/search.dto';
  import { ActivatedDeviseDto } from './dto/activatedDevise.dto';
  @Controller('devise')
  export class DeviseController {
    constructor(private readonly deviseService: DeviseService) {}
  
    @Post()
    async create(@Body() deviseDto: DeviseDto): Promise<Devise> {
      try {
        const createdDevise = await this.deviseService.create(deviseDto); // Utilisation de `await`
        return createdDevise;
      } catch (error) {
        if (error instanceof ConflictException) {
          throw new ConflictException('Duplicate Devise entered');
        }
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    @Patch('activated/:id')
  async activatedTimbre(
    @Param('id') id: string,
    @Body() activatedDeviseDto: ActivatedDeviseDto
  ) {
    return await this.deviseService.activatedDevise(id, activatedDeviseDto);
  }
    
    @Get()
    async findAll(): Promise<Devise[]> { // Utilisation du type correct pour le retour
      return await this.deviseService.findAll(); // Utilisation de `await`
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() deviseDto: DeviseDto,
    ): Promise<Devise> {
      try {
        const updatedDevise = await this.deviseService.update(id, deviseDto);
        return updatedDevise;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Devise with ID ${id} not found`);
        }
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string }> {
      try {
        const deletedDevise = await this.deviseService.delete(id);
        if (!deletedDevise) {
          throw new NotFoundException(`Devise with ID ${id} not found`);
        }
        return { message: 'Devise deleted successfully' };
      } catch (error) {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    @Post('/search')
    async search(@Query() searchDto: SearchDTO): Promise<Devise[]> {
      try {
        const results = await this.deviseService.search(searchDto.key);
        return results;
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'An error occurred while searching',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  