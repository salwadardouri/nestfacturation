import { IsNotEmpty } from 'class-validator';

export class ActivatedClientDto {


  @IsNotEmpty()
  readonly status?: boolean;
  




}
