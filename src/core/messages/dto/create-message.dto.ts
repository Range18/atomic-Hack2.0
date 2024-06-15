import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  readonly issueId: string;

  @IsString()
  readonly text: string;

  @IsString()
  readonly authorId: string;

  @IsBoolean()
  @IsOptional()
  readonly isQuestion: boolean = false;
}
