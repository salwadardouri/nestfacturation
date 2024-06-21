import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class EcheanceDto {
  @IsNumber()
  @IsOptional()
  numCheque: number;

  @IsNumber()
  @IsOptional()
  montantCheque: number;
  dateCh: Date;
  @IsOptional()
  dateEcheance: Date;
  @IsOptional()
  paiements: string[]; // IDs des paiements associés
}