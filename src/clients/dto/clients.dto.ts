import { IsString, IsEmail,  IsNotEmpty,IsOptional} from 'class-validator';

export class ClientDto {
 
  readonly fullname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;
  
logo:string;
 

  readonly password: string;



  readonly  country: string;

  readonly num_phone: string;


  readonly address: string;

  

  readonly code_postal: string;
  readonly roles: string[];

  readonly matricule_fiscale:string;
  readonly type:string;
  
}