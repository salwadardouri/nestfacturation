// search-service.dto.ts

import { IsNumber, IsOptional } from 'class-validator';

export class SearchDto {
  @IsOptional()
  @IsNumber()
Valeur?: number;
}