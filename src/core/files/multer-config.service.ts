import { HttpStatus, Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import multer from 'multer';
import { Request } from 'express';
import { storageConfig } from '#src/common/configs/storage.config';
import { extname } from 'path';
import { uid } from 'uid/secure';
import { ApiException } from '#src/common/exception-handler/api-exception';
import { AllExceptions } from '#src/common/exception-handler/exeption-types/all-exceptions';
import FileExceptions = AllExceptions.FileExceptions;

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: (req, file, callback) => {
          // if (!this.checkMimetype(file.mimetype)) {
          //   return callback(new Error('file extension is not allowed'), '');
          // }

          if (!file) {
            throw new ApiException(
              HttpStatus.NOT_FOUND,
              'FileExceptions',
              FileExceptions.NotFound,
            );
          }

          return callback(null, storageConfig.path);
        },
        filename(
          req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const isDocument = req.query['isDocument'];

          if (isDocument == 'true') {
            callback(
              null,
              `${uid(16)}${extname(Buffer.from(file.originalname, 'hex').toString())}`,
            );
            return;
          }

          callback(null, `${uid(16)}${extname(file.originalname)}`);
        },
      }),
    };
  }

  private checkMimetype(mimetype: string): boolean {
    return storageConfig.allowedMimetypes.includes(mimetype);
  }
}
