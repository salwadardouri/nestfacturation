
  import { IsString, IsNumber, IsMongoId, IsNotEmpty } from 'class-validator';

export class ServicesDto {
  

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsNumber()
  quantite: number;

  @IsNumber()
  prix_unitaire: number;
  @IsNumber()
  montant_HT: number;
  @IsNumber()
  montant_TTC: number;
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
