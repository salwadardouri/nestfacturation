import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ModifierPasswordDto {
 
  email: string;

  Password: string;
  newPassword: string;
}