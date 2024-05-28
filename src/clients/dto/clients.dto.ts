import { IsString, IsEmail,  IsNotEmpty,IsOptional} from 'class-validator';

export class ClientDto {
  @IsNotEmpty()
  @IsString()
  readonly fullname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
  
logo:string;
 

  readonly password: string;
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




  @IsNotEmpty()
  @IsString()
  readonly  country: string;

  @IsNotEmpty()
  @IsString()
  readonly num_phone: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly code_postal: string;
  readonly roles: string[];

  readonly matricule_fiscale:string;
  readonly type:string;
  
}