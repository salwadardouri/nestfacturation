import { IsBoolean } from 'class-validator';

export class UpdatePassDto {
  @IsBoolean()
  readonly updatedPass: boolean;
}
