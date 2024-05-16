import { IsString, IsNumber, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class FactureDto {
  

  @IsNotEmpty()
  @IsNumber()
  quantite: number;


  @IsNotEmpty()
  @IsString()
  unite: string;
  @IsNotEmpty()
  @IsNumber()
  montant_HT: number;
  @IsNotEmpty()
  @IsNumber()
  montant_TTC: number;

  @IsNotEmpty()
  @IsNumber()
  remise: number;

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsMongoId()
  @IsNotEmpty()
  tvaId: string;

  @IsMongoId()
  @IsNotEmpty()
  serviceId: string;

  @IsMongoId()
  @IsOptional()
  timbreId: string;
}
