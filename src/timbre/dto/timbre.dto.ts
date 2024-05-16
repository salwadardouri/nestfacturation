import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class TimbreDto {
  @IsNumber()
  @IsNotEmpty()
Valeur: number;
@IsMongoId()
@IsNotEmpty()
deviseId: string;

}
