import { IsString, IsEmail, MinLength, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly fullname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;



  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly num_phone: number;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly code_postal: number;

 

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one role must be provided' })
  readonly roles: string[];
  
  constructor() {
    this.roles = ['EMPLOYEUR']; // Initialiser le champ roles avec la valeur par défaut
  }
}
