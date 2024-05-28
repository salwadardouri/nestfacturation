// update-facture.dto.ts
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateFactureDto {
  @IsOptional()
  @IsString()
  readonly tvaId: string;

  @IsOptional()
  @IsNumber()
  readonly prix_unitaire: number;

  @IsOptional()
  @IsNumber()
  readonly quantite: number;

  @IsOptional()
  @IsNumber()
  readonly remise: number;

  @IsOptional()
  @IsNumber()
  readonly montant_HT: number;
}
