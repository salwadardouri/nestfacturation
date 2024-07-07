// createuser.dto.ts
import {  IsArray } from 'class-validator';

export class CreateUserDto {

  fullname: string;


  email: string;

  password: string;


  country: string;

  num_phone: string;


  address: string;


  code_postal: string;

  @IsArray()
 
  roles: string[];
}
