
  import { IsString, IsNumber, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class ServicesDto {
  

  @IsString()
  @IsNotEmpty()
  libelle: string;

  readonly status?: boolean;
  @IsNumber()
  prix_unitaire: number;
  @IsMongoId()
  @IsNotEmpty()
  deviseId: string;
  @IsMongoId()
  @IsNotEmpty()
  categoriesId : string;
  @IsMongoId()
  @IsOptional()
  tva:string; 
   @IsString()
  @IsNotEmpty()
  unite: string;

}
