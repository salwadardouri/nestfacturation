import { Controller, Post, Get, Put, Param, Body, Query,Patch } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisAjoutClientDto} from './dto/DevisAjoutClient.dto';
import { ClientDto } from 'src/clients/dto/clients.dto';
import { PatchDevisDto} from './dto/PatchDevis.dto';
import { Devis } from 'src/schemas/devis.schema';
@Controller('devis')
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Patch(':id')
  async updateDevis(@Param('id') id: string, @Body() patchDevisDto: PatchDevisDto): Promise<Devis> {
    return this.devisService.updateDevis(id, patchDevisDto);
  }
  @Post()
  async create(@Body() createDevisAjoutClient: DevisAjoutClientDto) {
    return this.devisService.createDevis(createDevisAjoutClient);
  }
  @Get()
  async findAll(): Promise<DevisAjoutClientDto[]> {
    return this.devisService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<DevisAjoutClientDto> {
    return this.devisService.findOne(id);
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateDevisAjoutClient: DevisAjoutClientDto): Promise<DevisAjoutClientDto> {
    return this.devisService.update(id, updateDevisAjoutClient);
  }

  @Get('/client/:clientId')
  async findByClientId(@Param('clientId') clientId: string): Promise<{ client: ClientDto, devis: DevisAjoutClientDto[] }> {
    return this.devisService.findByClientId(clientId);
  }

  @Get('/search')
  async search(@Query('query') query: string): Promise<DevisAjoutClientDto[]> {
    return this.devisService.search(query);
  }
}
