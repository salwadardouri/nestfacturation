import { IsString, IsEmail, MinLength, IsNotEmpty, IsIn,ArrayUnique,IsArray ,ArrayNotEmpty} from 'class-validator';
import { UserRole } from '../roles.enum';

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


  readonly  country: string;


  readonly num_phone: number;

  readonly address: string;


  readonly code_postal: number;
  

  roles: UserRole[];
  readonly matricule_fiscale:string;
  readonly type:string;
  
}