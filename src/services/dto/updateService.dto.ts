import { IsString, IsNumber, IsMongoId, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateServiceDto {
  @IsString()
  @IsOptional() // Peut être optionnel pour une mise à jour partielle
  libelle?: string;

  @IsNumber()
  @IsOptional() // Peut être optionnel
  quantite?: number;

  @IsNumber()
  @IsOptional() // Peut être optionnel
  prix_unitaire?: number;

  @IsNumber()
  @IsOptional() // Peut être optionnel
  montant_HT?: number;

  @IsNumber()
  @IsOptional() // Peut être optionnel
  montant_TTC?: number;

  @IsMongoId()
  @IsOptional() // Peut être optionnel
  clientId?: string; 

  @IsMongoId()
  @IsOptional() // Peut être optionnel
  tvaId?: string; 

  @IsMongoId()
  @IsOptional() // Peut être optionnel
  deviseId?: string;

  @IsMongoId()
  @IsOptional() // Peut être optionnel
  categoriesId?: string;
}
