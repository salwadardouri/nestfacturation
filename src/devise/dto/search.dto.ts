import { IsNotEmpty, IsString } from 'class-validator';

export class SearchDTO{
  @IsString()

  key: string;
}
