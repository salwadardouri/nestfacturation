
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
  clientId: string; // L'identifiant du client associé

  @IsMongoId()
  @IsNotEmpty()
  tvaId: string; // L'identifiant de la TVA associée
}
