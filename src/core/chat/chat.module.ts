import { Module } from '@nestjs/common';

import { MessagesModule } from '#src/core/messages/messages.module';
import { ChatGateway } from '#src/core/chat/chat.gateway';
import { IssuesModule } from '#src/core/issues/issues.module';
import { FilesModule } from '#src/core/files/files.module';

@Module({
  imports: [MessagesModule, IssuesModule, FilesModule],
  providers: [ChatGateway],
})
export class ChatModule {}
