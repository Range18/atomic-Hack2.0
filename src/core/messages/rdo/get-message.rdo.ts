import { Message } from '#src/core/messages/entities/message.entity';
import { backendServer } from '#src/common/configs/config';

export class GetMessageRdo {
  readonly id: string;

  readonly issueId: string;

  readonly text: string;

  readonly authorId: string;

  readonly fileLink?: string;

  readonly page?: number;

  readonly createdAt: Date;

  constructor(message: Message, fileName?: string, page?: number) {
    this.id = message.id;
    this.issueId = message.issueId;
    this.text = message.text;

    if (fileName) {
      this.fileLink = backendServer.urlValue + `/files/source/${fileName}`;
    } else if (message.document) {
      this.fileLink = message.document;
    }
    this.page = page ?? message.page;
    this.authorId = message.authorId;
    this.createdAt = message.createdAt;
  }
}
