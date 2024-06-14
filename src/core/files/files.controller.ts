import {
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { File } from '#src/core/files/entities/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Like } from 'typeorm';
import { GetFileDto } from '#src/core/files/dto/get-file.dto';
import { GetDocumentPartDto } from '#src/core/files/dto/get-document-part.dto';
import { InstructionRdo } from '#src/core/files/rdo/instructionRdo';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @ApiQuery({ name: 'isDocument', type: Boolean })
  @Post()
  async uploadFile(
    @Query('isDocument', new ParseBoolPipe())
    isDocument: boolean,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<File> {
    if (isDocument) {
      return await this.filesService.uploadDocument(file);
    }
    return await this.filesService.upload(file);
  }

  @Get()
  @ApiQuery({ name: 'isDocument', type: Boolean })
  @ApiQuery({ name: 'search', type: String })
  async getFiles(
    @Res({ passthrough: true }) res: Response,
    @Query() query: GetFileDto,
  ): Promise<File[]> {
    return await this.filesService.find({
      where: {
        isDocument: query.isDocument,
        originalName:
          query.isDocument && query.search
            ? Like(`%${query.search}%`)
            : undefined,
      },
    });
  }

  @Get('instructions')
  @ApiQuery({ name: 'isDocument', type: Boolean })
  @ApiQuery({ name: 'search', type: String })
  async getInstructionsFromFiles(
    @Query() query: GetDocumentPartDto,
  ): Promise<InstructionRdo[]> {
    return await this.filesService.getInstructionsFromFiles(query.question);
  }

  @Get(':name')
  async getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('name') name: string,
  ): Promise<File> {
    return await this.filesService.findOne({ where: { name: name } });
  }

  @Get('/source/:name')
  async getFileBuffer(
    @Res({ passthrough: true }) res: Response,
    @Param('name') name: string,
  ): Promise<StreamableFile> {
    const { buffer, mimetype } = await this.filesService.getFile(name);

    res.setHeader('Content-Type', mimetype);

    return buffer;
  }
}
