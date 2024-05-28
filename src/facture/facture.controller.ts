
import { Controller, Post,Put, Body, Get,Delete ,NotFoundException,HttpException,HttpStatus,Param} from '@nestjs/common';
import { FactureService } from './facture.service';
import { FactureDto } from 'src/facture/dto/facture.dto';


@Controller('facture')
export class FactureController {
  constructor(private readonly Service: FactureService) {}
  @Post()
  async create(@Body() factureDto: FactureDto) {
    try {
      const facture = await this.Service.create(factureDto);
      return { success: true, data: facture };
    } catch (error) {
      return { success: false, message: error.message, statusCode: 400 };
    }
  }

  @Get()
  async findAll(): Promise<FactureDto[]> {
    return this.Service.findAll();
  }

  
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const deletedFacture = await this.Service.delete(id);
      if (!deletedFacture) {
        throw new NotFoundException(`Facture not found`);
      }
      return { message: 'Facture deleted successfully' };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}
