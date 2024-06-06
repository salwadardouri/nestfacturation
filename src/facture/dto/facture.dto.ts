
import { Type } from 'class-transformer';
import { IsArray, IsMongoId } from 'class-validator';
import { ServiceFactDto } from 'src/services/dto/ServiceFact.dto';

export class FactureDto {
  
  total_HT: number;

  total_TVA: number;

  total_Remise: number;

  total_HT_Apres_Remise: number;

  total_TTC: number;




  @IsArray()
  @Type(() => ServiceFactDto)
  services: ServiceFactDto[];

  @IsMongoId()
  timbreid: string;

  @IsMongoId()

  deviseid: string;

  
  @IsMongoId()
  clientid: string;

  @IsMongoId()
  parametreid: string;
}