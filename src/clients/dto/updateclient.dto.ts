import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateClientDto {
@IsNotEmpty()
  @IsString()
  readonly fullname?: string;

@IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email?: string;



@IsNotEmpty()
  @IsString()
  readonly country?: string;

@IsNotEmpty()
  @IsString()
  readonly num_phone?: string;

@IsNotEmpty()
  @IsString()
  readonly address?: string;

@IsNotEmpty()
  @IsString()
  readonly code_postal?: string;


@IsOptional()
  @IsString()
  readonly matricule_fiscale?: string;

  @IsNotEmpty()
  readonly status?: boolean;
  

  @IsOptional()

  Nom_entreprise?: string;

  @IsOptional()

  num_fax?: string;

  @IsOptional()

  num_bureau?: string;

  @IsOptional()

  siteweb?: string;




}
