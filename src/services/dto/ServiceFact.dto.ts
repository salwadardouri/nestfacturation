
import {
  IsString,
  IsNumber,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class ServiceFactDto {
  @IsString()
  @IsNotEmpty()
 
  libelle: string;
  @IsString()
  @IsNotEmpty()
 
  unite: string;
  @IsString()
  reference: string;

  @IsNumber()
  prix_unitaire: number;
  montant_HT: number;
  montant_TTC: number;
  @IsNumber()
  @IsOptional()
  remise?: number = null;

  @IsNumber()
  @IsOptional()
  quantite?: number = null; 

  @IsMongoId()
  @IsNotEmpty()
  deviseId?: string = null;

  

  @IsMongoId()
  @IsOptional()
  tvaId?: string = null; 

  readonly status: boolean = true;
}