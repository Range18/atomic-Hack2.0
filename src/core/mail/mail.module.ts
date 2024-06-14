import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { FilesModule } from '#src/core/files/files.module';
import { AuthModule } from '#src/core/auth/auth.module';

@Module({
  imports: [FilesModule, AuthModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
