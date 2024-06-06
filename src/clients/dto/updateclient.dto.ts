import { IsString, IsEmail, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  readonly fullname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly country?: string;

  @IsOptional()
  @IsString()
  readonly num_phone?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly code_postal?: string;

  @IsOptional()
  @IsString()
  matricule_fiscale?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsString()
  Nom_entreprise?: string;

  @IsOptional()
  @IsString()
  num_fax?: string;

  @IsOptional()
  @IsString()
  num_bureau?: string;

  @IsOptional()
  @IsString()
  siteweb?: string;
}
