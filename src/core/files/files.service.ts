import { HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
import { BaseEntityService } from '#src/common/base-entity.service';
import { File } from '#src/core/files/entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream } from 'node:fs';
import { join } from 'path';
import { storageConfig } from '#src/common/configs/storage.config';
import axios from 'axios';
import { AILink } from '#src/common/configs/config';
import { ApiException } from '#src/common/exception-handler/api-exception';
import { AllExceptions } from '#src/common/exception-handler/exeption-types/all-exceptions';
import { InstructionRdo } from '#src/core/files/rdo/instructionRdo';
import * as child_process from 'node:child_process';
import * as console from 'node:console';
import { MessageToAIDto } from '#src/core/messages/dto/message-to-AI.dto';
import FileExceptions = AllExceptions.FileExceptions;

@Injectable()
export class FilesService extends BaseEntityService<File> {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {
    super(fileRepository);
  }

  private readonly httpClient = axios.create({
    ...axios.defaults,
    baseURL: AILink,
  });

  async upload(file: Express.Multer.File): Promise<File> {
    return await this.save({
      name: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });
  }

  async uploadDocument(file: Express.Multer.File): Promise<File> {
    return await this.save({
      isDocument: true,
      name: file.filename,
      originalName: Buffer.from(file.originalname, 'hex').toString(),
      mimeType: file.mimetype,
    });
  }

  async getFile(
    name: string,
  ): Promise<{ buffer: StreamableFile; mimetype: string }> {
    const file = await this.findOne({ where: { name: name } });

    const stream = createReadStream(join(storageConfig.path, file.name));

    return { buffer: new StreamableFile(stream), mimetype: file.mimeType };
  }

  async getInstructionsFromFiles(context: MessageToAIDto[]) {
    const res = await this.httpClient.post<{
      answer: string;
      useful_instructions: [
        {
          filename: string;
          title: string;
          modified_text: string;
          text: string;
        },
      ];
    }>('/chat', { messages: context });

    console.log(res.data);

    return {
      answer: res.data.answer,
      instructions: await Promise.all(
        res.data.useful_instructions.map(async (instruction) => {
          const file = await this.findOne({
            where: { originalName: instruction.filename },
          });

          if (!file) {
            throw new ApiException(
              HttpStatus.NOT_FOUND,
              'FileExceptions',
              FileExceptions.NotFound,
            );
          }

          //find page number in PDF instructions
          const regexToParsePageNumber = /Page (\d+):/;
          let page = null;

          const textWords = instruction.text.split(' ');
          const command = `rga -U "(?s)${textWords.slice(0, textWords.length < 10 ? textWords.length : 10).join('.*')}" ${join('/home/helper', storageConfig.path, file.name)}`;

          const process = child_process.spawn(command, { shell: true });

          process.on('spawn', () => console.log('spawned:', command));

          process.stdout.on('data', (message) => {
            const match = message.toString().match(regexToParsePageNumber);

            // console.log(message.toString());

            if (match) {
              page = Number(match[1]);
            }
          });

          process.on('error', (err) => {
            console.log('Error during finding file page:', err);
          });

          await new Promise((resolve) => {
            process.on('exit', resolve);
          });

          //find page number in title of PDF instructions
          if (!page) {
            const titleWords = instruction.title.split(' ');
            const command = `rga -U "(?s)${titleWords.slice(0, titleWords.length < 10 ? titleWords.length : 10).join('.*')}" ${join('/home/helper', storageConfig.path, file.name)}`;

            const process = child_process.spawn(command, { shell: true });

            process.on('spawn', () => console.log('spawned:', command));

            process.stdout.on('data', (message) => {
              const match = message.toString().match(regexToParsePageNumber);

              // console.log(message.toString());

              if (match) {
                page = Number(match[1]);
              }
            });

            process.on('error', (err) => {
              console.log('Error during finding file page:', err);
            });

            await new Promise((resolve) => {
              process.on('exit', resolve);
            });
          }

          return new InstructionRdo(
            instruction.filename,
            instruction.title,
            instruction.modified_text,
            file,
            page,
          );
        }),
      ),
    };
  }
}
