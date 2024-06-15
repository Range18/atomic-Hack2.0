import { IsBoolean } from 'class-validator';

export class UpdateIssueDto {
  @IsBoolean()
  readonly isClosed: boolean;
}
