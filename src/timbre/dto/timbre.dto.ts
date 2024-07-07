import { IsMongoId, IsNotEmpty, IsNumber,IsOptional } from 'class-validator';

export class TimbreDto {
  @IsNumber()
  @IsNotEmpty()
Valeur: number;
@IsMongoId()
@IsOptional()
deviseId: string;
@IsNotEmpty()
readonly status?: boolean;

}
