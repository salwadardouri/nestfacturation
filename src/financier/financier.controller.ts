import {Controller,Get,Post,Body,Param,Put,Res,Query, HttpStatus, NotFoundException,ValidationPipe , HttpException} from '@nestjs/common';
import { Response } from 'express';
  import { FinancierDto } from 'src/financier/dto/financier.dto';
  import {ChangePasswordDto } from 'src/financier/dto/change-password.dto';
  import { FinancierService } from './financier.service';
import { Financier } from 'src/schemas/financier.schema';
import { SearchDTO } from 'src/financier/dto/search.dto';
import { UpdateDto } from 'src/financier/dto/update.dto';

@Controller('financier')
export class  FinancierController {
    constructor(private readonly service: FinancierService) {}
    @Post('create-account')
    async createAccount(@Body() financierDto: FinancierDto, @Res() res: Response): Promise<{ user: Financier; resetLink: string; message: string }> {
      try {
        const { user, resetLink, message } = await this.service.createAccount(financierDto);
        res.status(HttpStatus.CREATED).json({ message: 'User created successfully', user });
        return { user, resetLink, message };
      }  catch (error) {
        if (error instanceof HttpException && error.getStatus() === HttpStatus.CONFLICT) {
          res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists, please enter another email' });
        } else {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
      }
    }

    @Put(':id/change-password')
    async changePassword(@Param('id') financierId: string, @Body() changePasswordDto: ChangePasswordDto) {
      const result = await this.service.changePassword(financierId, changePasswordDto);
      if (!result) {
        throw new NotFoundException('Financier not found');
      }
      return result;
    }
    @Get()
    async getFinanciers(): Promise<Financier[]> {
      return this.service.getFinanciers();
    }
    @Get('/:id')
    FindOne(@Param('id') id: string) {
      return this.service.FindOne(id);
    }
 

    @Post('/search')
    async Search(@Query() searchDto: SearchDTO) {
      try {
        return await this.service.Search(searchDto.key);
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        }, HttpStatus.NOT_FOUND);
      }
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDto:UpdateDto): Promise<Financier> {
      return await this.service.update(id,updateDto);
    }
  }
