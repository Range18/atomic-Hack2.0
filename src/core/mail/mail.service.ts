import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { createTransport, Transporter } from 'nodemailer';
import { smtpConfig } from '#src/common/configs/smtp.config';
import { FilesService } from '#src/core/files/files.service';
import { In } from 'typeorm';
import { Attachment } from 'nodemailer/lib/mailer';
import { join } from 'path';
import { storageConfig } from '#src/common/configs/storage.config';
import { unlink } from 'fs/promises';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private readonly filesService: FilesService) {
    this.transporter = createTransport(smtpConfig);
  }

  async sendMail(mailDto: CreateMailDto): Promise<void> {
    const files = await this.filesService.find({
      where: { name: In(mailDto.filesNames) },
    });

    const attachments: Attachment[] = files.map((file) => {
      return {
        filename: file.originalName,
        contentType: file.mimeType,
        path: join(storageConfig.path, file.name),
      };
    });

    await this.transporter
      .sendMail({
        to: smtpConfig.from,
        subject: mailDto.name,
        text: mailDto.text,
        attachments: attachments,
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });

    for await (const file of files) {
      await unlink(join(storageConfig.path, file.name)).catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });
    }

    await this.filesService.remove(files);
  }
}
