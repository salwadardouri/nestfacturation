import { IsString, IsEmail, MinLength, IsNotEmpty, IsIn,ArrayUnique,IsArray ,ArrayNotEmpty} from 'class-validator';


export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly fullname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly  country: string;

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
  @ArrayUnique()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'Au moins un rôle doit être fourni' })
  readonly roles: string[];
  
}