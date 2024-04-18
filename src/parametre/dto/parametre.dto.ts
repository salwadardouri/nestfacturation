import { IsString, IsEmail, IsNumber, IsNotEmpty } from 'class-validator';

export class ParametreDto {
  @IsNotEmpty()
  @IsString()
  ref: string;

  @IsNotEmpty()
  @IsString()
  Nom_S: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  Email_S: string;

  @IsNotEmpty()
  @IsString()
  Paye_S: string;

  @IsNotEmpty()
  @IsString()
  Address_S: string;

  @IsNotEmpty()
  @IsString()
  Num_Phone_S: string;

  @IsNotEmpty()
  @IsString()
  Code_Postal_S: string;

  @IsNotEmpty()
  @IsString()
  Matricule_Fiscale_S: string;
}