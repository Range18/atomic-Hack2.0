import { Issue } from '#src/core/issues/entities/issue.entity';
import { GetMessageRdo } from '#src/core/messages/rdo/get-message.rdo';

export class GetIssueRdo {
  readonly issueId: string;

  readonly authorId: string;

  readonly isClosed: boolean;

  readonly messages: GetMessageRdo[];

  readonly createdAt: Date;

  readonly updatedAt: Date;

  constructor(issue: Issue) {
    this.issueId = issue.issueId;
    this.authorId = issue.authorId;
    this.isClosed = issue.isClosed;
    this.messages = issue.messages
      ? issue.messages.map((message) => new GetMessageRdo(message))
      : [];
    this.createdAt = issue.createdAt;
    this.updatedAt = issue.updatedAt;
  }
}
