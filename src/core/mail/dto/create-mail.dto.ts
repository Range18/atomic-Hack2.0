import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateMailDto {
  @IsString()
  readonly authorId: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly text: string;

  @IsArray()
  @IsOptional()
  readonly filesNames?: string[];
}
