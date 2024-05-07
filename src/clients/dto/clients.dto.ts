import { IsString, IsEmail, IsOptional, IsNotEmpty,ArrayUnique,IsArray ,ArrayNotEmpty} from 'class-validator';
import { UserRole } from 'src/auth/roles.enum';

export class ClientDto {
  @IsNotEmpty()
  @IsString()
  readonly fullname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @IsString()
  @IsOptional()
  logo?: string;

  readonly password: string;



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
  
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'Au moins un rôle doit être fourni' })
  roles: UserRole[];
  readonly matricule_fiscale:string;
  readonly type:string;
  
}