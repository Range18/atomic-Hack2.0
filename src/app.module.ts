import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '#src/common/configs/database.config';
import { UserModule } from '#src/core/users/user.module';
import { AuthModule } from '#src/core/auth/auth.module';
import { MessagesModule } from '#src/core/messages/messages.module';
import { ChatModule } from '#src/core/chat/chat.module';
import { IssuesModule } from '#src/core/issues/issues.module';
import { FilesModule } from '#src/core/files/files.module';
import { QuestionTypesModule } from '#src/core/question-types/question-types.module';
import { MailModule } from '#src/core/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    MessagesModule,
    ChatModule,
    IssuesModule,
    FilesModule,
    QuestionTypesModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
