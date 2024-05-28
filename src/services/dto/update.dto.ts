
import { IsString, IsNumber, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateDto {
  
    @IsString()
    @IsNotEmpty()
    reference: string;
  
  @IsString()
  @IsNotEmpty()
  libelle: string;


  @IsNumber()
  prix_unitaire: number;


  @IsMongoId()
  @IsNotEmpty()
  deviseId: string;
  
  @IsMongoId()
  @IsNotEmpty()
  categoriesId : string;


}
