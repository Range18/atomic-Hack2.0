import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
