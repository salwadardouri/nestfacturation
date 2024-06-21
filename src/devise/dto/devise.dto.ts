
import { IsString, IsNotEmpty } from 'class-validator';

export class DeviseDto {

  @IsString()
  @IsNotEmpty()
  Nom_D: string;
  @IsString()
  @IsNotEmpty()
  Symbole: string;

  @IsNotEmpty()
  readonly status?: boolean;
}
