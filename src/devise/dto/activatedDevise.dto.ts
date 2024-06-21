import { IsNotEmpty } from 'class-validator';

export class ActivatedDeviseDto {


  @IsNotEmpty()
  readonly status?: boolean;
  




}
