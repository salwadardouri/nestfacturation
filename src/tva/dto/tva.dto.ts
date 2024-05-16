
import { IsNumber, IsNotEmpty } from 'class-validator';

export class TvaDto {

  @IsNumber()
  @IsNotEmpty()
  Pourcent_TVA: number;



}
