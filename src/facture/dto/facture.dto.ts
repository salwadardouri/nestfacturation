import { IsString, IsNumber,IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class FactureDto {
  

  @IsNotEmpty()
  @IsString()
  unite: string;

  @IsNotEmpty()
  @IsNumber()
  montant_TTC: number;
  
  @IsMongoId()
  @IsNotEmpty()
  clientId: string;


  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  serviceId: string[];


  @IsMongoId()
  @IsOptional()
  timbreId: string;
}
