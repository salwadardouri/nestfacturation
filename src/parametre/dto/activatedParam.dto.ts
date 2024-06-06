import { IsNotEmpty } from 'class-validator';

export class ActivatedParamDto {


  @IsNotEmpty()
  readonly status?: boolean;
  
}
