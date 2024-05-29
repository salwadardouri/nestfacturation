import { IsNotEmpty } from 'class-validator';

export class ActivatedServiceDto {


  @IsNotEmpty()
  readonly status?: boolean;
  




}
