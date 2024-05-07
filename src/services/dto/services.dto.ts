
  import { IsString, IsNumber, IsMongoId, IsNotEmpty } from 'class-validator';

export class ServicesDto {
  

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsNumber()
  quantite: number;

  @IsNumber()
  prix_unitaire: number;
  montant_HT: number;
  @IsMongoId()
  @IsNotEmpty()
  clientId: string; 

  @IsMongoId()
  @IsNotEmpty()
  tvaId: string; 

  @IsMongoId()
  @IsNotEmpty()
  deviseId: string;
  
  @IsMongoId()
  @IsNotEmpty()
  categoriesId : string;
}
