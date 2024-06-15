import { IsString } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  readonly issueId: string;

  @IsString()
  readonly authorId: string;
}
