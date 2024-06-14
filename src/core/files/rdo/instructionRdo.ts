import { File } from '#src/core/files/entities/file.entity';
import { backendServer } from '#src/common/configs/config';

export class InstructionRdo {
  readonly originalName: string;

  readonly filename: string;

  readonly mimetype: string;

  readonly url: string;

  readonly title: string;

  readonly text: string;

  readonly page?: number;

  constructor(
    filename: string,
    title: string,
    text: string,
    file: File,
    page?: number,
  ) {
    this.originalName = filename;
    this.filename = file.name;
    this.mimetype = file.mimeType;
    this.url = backendServer.urlValue + `/files/source/${file.name}`;
    this.text = text;
    this.title = title;
    this.page = page;
  }
}
