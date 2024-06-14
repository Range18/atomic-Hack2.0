import { IsString } from 'class-validator';

export class GetDocumentPartDto {
  @IsString()
  question: string;
}
