import { IsString, IsEmail, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateClientDto {
  
  readonly fullname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email?: string;


  readonly country?: string;


  readonly num_phone?: string;


  readonly address?: string;


  readonly code_postal?: string;

  matricule_fiscale?: string;

  status?: boolean;



}
