import { IsNotEmpty } from 'class-validator';

export class ActivatedTimbreDto {


  @IsNotEmpty()
  readonly status?: boolean;
  




}
