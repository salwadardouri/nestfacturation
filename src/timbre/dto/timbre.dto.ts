import { IsString, IsNotEmpty } from 'class-validator';

export class TimbreDto {
  @IsString()
  @IsNotEmpty()
Valeur: string;

}
