// change-password.dto.ts

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
