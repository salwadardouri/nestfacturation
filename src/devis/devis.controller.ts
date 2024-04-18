import { Controller, Post, Get, Put, Param, Body, Query } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisDto } from './dto/devis.dto';
import { ClientDto } from 'src/clients/dto/clients.dto';
@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  async create(@Body() createDevisDto: DevisDto) {
    return this.devisService.create(createDevisDto);
  }
  @Get()
  async findAll(): Promise<DevisDto[]> {
    return this.devisService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<DevisDto> {
    return this.devisService.findOne(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateDevisDto: DevisDto): Promise<DevisDto> {
    return this.devisService.update(id, updateDevisDto);
  }

  @Get('/client/:clientId')
  async findByClientId(@Param('clientId') clientId: string): Promise<{ client: ClientDto, devis: DevisDto[] }> {
    return this.devisService.findByClientId(clientId);
  }

  @Get('/search')
  async search(@Query('query') query: string): Promise<DevisDto[]> {
    return this.devisService.search(query);
  }
}
