import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from '#src/core/messages/messages.service';
import { CreateMessageDto } from '#src/core/messages/dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { GetMessageRdo } from '#src/core/messages/rdo/get-message.rdo';
import { IssuesService } from '#src/core/issues/issues.service';
import * as console from 'node:console';
import { FilesService } from '#src/core/files/files.service';
import { uid } from 'uid/secure';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://helper-frontend.vercel.app',
      'https://helper-modal.vercel.app',
    ],
    credentials: true,
  },
})
export class ChatGateway {
  constructor(
    private readonly messageService: MessagesService,
    private readonly issuesService: IssuesService,
    private readonly fileService: FilesService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateMessageDto,
  ): Promise<void> {
    let issue = await this.issuesService.findOne({
      where: { issueId: data.issueId },
      relations: { messages: true },
    });

    if (!issue) {
      issue = await this.issuesService.save({
        issueId: uid(16),
        authorId: data.authorId,
      });
    } else if (issue.isClosed) {
      issue = await this.issuesService.save({
        issueId: uid(16),
        authorId: data.authorId,
      });
    }

    const message = await this.messageService.save({
      issueId: issue.issueId,
      text: data.text,
      authorId: data.authorId,
    });

    client.to(data.authorId).emit('receiveMessage', new GetMessageRdo(message));

    if (data.isQuestion) {
      // console.log(issue.messages);
      // const issueMessages = issue.messages
      //   ? issue.messages.concat(message)
      //   : [message];
      //
      // const context = issueMessages.map(
      //   (message) =>
      //     new MessageToAIDto(
      //       message.authorId == '0' ? 'assistant' : 'user',
      //       message.text,
      //     ),
      // );

      const answerFromAI = await this.fileService.getInstructionsFromFiles(
        message.text,
      );

      const isAnswer = !answerFromAI.every((answer) =>
        answer.text.toLowerCase().includes('нет фрагмента'),
      );

      const withPageAndLink = answerFromAI.filter(
        (answer) => !answer.text.toLowerCase().includes('нет фрагмента'),
      );

      const text = withPageAndLink.reduce(
        (previousValue, currentValue) => previousValue + `${currentValue.text}`,
        '',
      );

      const messageFromAI = await this.messageService.save({
        issueId: issue.issueId,
        text: isAnswer
          ? text
          : 'К сожалению, не могу ответить на ваш вопрос. Переключаю на оператора техподдержки.',
        authorId: '0',
        page:
          isAnswer && withPageAndLink.length > 0
            ? withPageAndLink[0].page
            : null,
        document:
          isAnswer && withPageAndLink.length > 0
            ? withPageAndLink[0].filename
            : undefined,
        isQuestion: false,
      });

      this.server
        .to(data.authorId)
        .emit(
          'receiveMessage',
          new GetMessageRdo(
            messageFromAI,
            answerFromAI[0].filename,
            answerFromAI[0].page,
          ),
        );
    }
  }

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connecting', client.id);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() rooms: string[]) {
    console.log('joining room', client.id, rooms);

    client.join(rooms);
  }

  @SubscribeMessage('disconnecting')
  handleDisconnection(@ConnectedSocket() client: Socket) {
    console.log('disconnecting', client.id);
  }
}
