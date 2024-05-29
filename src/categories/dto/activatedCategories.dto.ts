import { IsNotEmpty } from 'class-validator';

export class ActivatedCategoriesDto {


  @IsNotEmpty()
  readonly status?: boolean;
  




}
