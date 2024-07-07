import { IsString, IsEmail, MinLength, IsNotEmpty, IsIn,ArrayUnique,IsArray ,ArrayNotEmpty} from 'class-validator';
import { UserRole } from '../roles.enum';

export class AdminDto {
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


  

  roles: UserRole[];

}