import { Message } from '#src/core/messages/entities/message.entity';
import { backendServer } from '#src/common/configs/config';
import { GetDocumentInAnswerRdo } from '#src/core/files/rdo/get-document-in-answer.rdo';
import { InstructionRdo } from '#src/core/files/rdo/instructionRdo';

export class GetMessageRdo {
  readonly id: string;

  readonly issueId: string;

  readonly text: string;

  readonly authorId: string;

  readonly documents: GetDocumentInAnswerRdo[];

  readonly createdAt: Date;

  constructor(message: Message, instrustions?: InstructionRdo[]) {
    this.id = message.id;
    this.issueId = message.issueId;
    this.text = message.text;

    this.documents = [];

    if (instrustions && instrustions.length > 0) {
      for (let i = 0; i < instrustions.length; ++i) {
        this.documents.push({
          fileLink:
            backendServer.urlValue + `/files/look/${instrustions[i].filename}`,
          page: instrustions[i].page,
          title: instrustions[i].originalName,
        });
      }
    } else if (
      message.document &&
      message.page &&
      message.documentOriginalNames
    ) {
      const documentNames = message.document.split('$');
      const pagesArr = message.page.split('$');
      const originalNames = message.documentOriginalNames.split('$');
      for (let i = 0; i < documentNames.length; ++i) {
        this.documents.push({
          fileLink: backendServer.urlValue + `/files/look/${documentNames[i]}`,
          page: Number(pagesArr[i]),
          title: originalNames[i],
        });
      }
    }
    this.authorId = message.authorId;
    this.createdAt = message.createdAt;
  }
}
