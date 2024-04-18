
import { IsString, IsNotEmpty } from 'class-validator';

export class TvaDto {
  @IsString()
  @IsNotEmpty()
  Pourcent_TVA: string;



}
