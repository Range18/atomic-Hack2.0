import { Message } from '#src/core/messages/entities/message.entity';
import { backendServer } from '#src/common/configs/config';
import { GetDocumentInAnswerRdo } from '#src/core/files/rdo/get-document-in-answer.rdo';

export class GetMessageRdo {
  readonly id: string;

  readonly issueId: string;

  readonly text: string;

  readonly authorId: string;

  readonly documents: GetDocumentInAnswerRdo[];

  readonly createdAt: Date;

  constructor(message: Message, fileNames?: string[], pages?: number[]) {
    this.id = message.id;
    this.issueId = message.issueId;
    this.text = message.text;

    this.documents = [];

    if (fileNames && fileNames.length > 0) {
      for (let i = 0; i < fileNames.length; ++i) {
        this.documents.push({
          fileLink: backendServer.urlValue + `/files/look/${fileNames[i]}`,
          page: pages[i],
        });
      }
    } else if (message.document) {
      const documentNames = message.document.split('$');
      const pagesArr = message.page.split('$');
      for (let i = 0; i < documentNames.length; ++i) {
        this.documents.push({
          fileLink: backendServer.urlValue + `/files/look/${documentNames[i]}`,
          page: Number(pagesArr[i]),
        });
      }
    }
    this.authorId = message.authorId;
    this.createdAt = message.createdAt;
  }
}
