// create-category.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  Titre_Categorie: string;
  @IsNotEmpty()
  Description_Categorie:string;
}
