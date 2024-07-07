
import { IsString, IsNumber, IsMongoId, IsNotEmpty ,IsOptional} from 'class-validator';

export class UpdateDto {
  
    @IsString()
    @IsNotEmpty()
    reference: string;
  
  @IsString()
  @IsNotEmpty()
  libelle: string;
  @IsString()
  @IsNotEmpty()
  unite: string;


  @IsNotEmpty()
  status?: boolean;
  
  @IsNumber()
  prix_unitaire: number;

  @IsOptional()
  @IsMongoId()
  deviseId: string;
  
  @IsOptional()
  @IsMongoId()
  categoriesId : string;


}
