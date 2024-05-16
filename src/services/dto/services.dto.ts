
  import { IsString, IsNumber, IsMongoId, IsNotEmpty } from 'class-validator';

export class ServicesDto {
  

  @IsString()
  @IsNotEmpty()
  libelle: string;


  @IsNumber()
  prix_unitaire: number;


  @IsMongoId()
  @IsNotEmpty()
  deviseId: string;
  
  @IsMongoId()
  @IsNotEmpty()
  categoriesId : string;
}
