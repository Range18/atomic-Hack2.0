export class CreateMessageDto {
  readonly issueId: string;

  readonly text: string;

  readonly authorId: string;

  readonly isQuestion: boolean = false;
}
