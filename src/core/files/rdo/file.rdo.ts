import { File } from '#src/core/files/entities/file.entity';
import { backendServer } from '#src/common/configs/config';

export class FileRdo {
  id: number;

  name: string;

  originalName: string;

  isDocument: boolean;

  mimeType: string;

  link: string;

  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.originalName = file.originalName;
    this.mimeType = file.mimeType;
    this.isDocument = file.isDocument;
    this.link = backendServer.urlValue + `/files/look/${file.name}`;
  }
}
