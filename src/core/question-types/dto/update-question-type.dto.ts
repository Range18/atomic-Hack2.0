import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuestionTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
