import { IsNotEmpty } from 'class-validator';

export class ActivatedTvaDto {


  @IsNotEmpty()
  readonly status?: boolean;
  




}
