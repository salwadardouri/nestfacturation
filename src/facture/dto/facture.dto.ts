
import { Type } from 'class-transformer';
import { IsArray, IsMongoId,IsDate,IsNotEmpty,IsOptional,IsNumber,IsString } from 'class-validator';
import { ServiceFactDto } from 'src/services/dto/ServiceFact.dto';

export class FactureDto {
  @IsNumber()
  total_HT: number;
  @IsNumber()
  total_TVA: number;
  @IsNumber()
  total_Remise: number;
  @IsNumber()
  total_HT_Apres_Remise: number;
  @IsNumber()
  total_TTC: number;
  @IsArray()
  @Type(() => ServiceFactDto)
  services: ServiceFactDto[];
  @IsOptional()
  @IsMongoId()
  timbreid: string;

  @IsMongoId()

  deviseid: string;

  
  @IsMongoId()
  clientid: string;

  @IsMongoId()
  parametreid: string; 

 


}