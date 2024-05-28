// patch-devis.dto.ts
import { IsOptional, IsString, IsNumber, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class PatchDevisDto {
  @IsNotEmpty()
  @IsString()
  Date_Envoi?: string;

  @IsNotEmpty()
  @IsNumber()
  Total_HT?: number;

  @IsNotEmpty()
  @IsNumber()
  Total_TVA?: number;

  @IsNotEmpty()
  @IsNumber()
  Total_TTC?: number;

  @IsNotEmpty()
  @IsBoolean()
  Etat?: boolean;

  @IsNotEmpty()
  @IsString()
  Num_Devis?: string;

  @IsNotEmpty()
  @IsNumber()
  prix_unitaire?: number;

  @IsNotEmpty()
  @IsNumber()
  montant_HT?: number;

  @IsNotEmpty()
  @IsMongoId()
  tva?: string;

  @IsOptional()
  @IsMongoId()
  timbre?: string;

  @IsNotEmpty()
  @IsMongoId()
  devise?: string;

  @IsNotEmpty()
  @IsMongoId()
  categories?: string;

  @IsNotEmpty()
  @IsMongoId()
  client?: string;

  @IsNotEmpty()
  @IsString()
  libelle?: string;

  @IsNotEmpty()
  @IsString()
  unite?: string;


  @IsNotEmpty()
  @IsNumber()
  quantite?: number;
}
