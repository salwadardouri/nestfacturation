import { IsString, IsNotEmpty, IsNumber, IsOptional,IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class DevisAjoutClientDto {
  @IsNotEmpty()
  @IsMongoId()
  clientId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  libelle: string;

  @IsNotEmpty()
  @IsMongoId()
  categoriesId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  deviseId: Types.ObjectId;
  @IsNotEmpty()
  @IsNumber()
  quantite: number;

  @IsNotEmpty()
  @IsString()
  unite: string;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
