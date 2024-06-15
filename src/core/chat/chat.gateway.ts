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
import { MessageToAIDto } from '#src/core/messages/dto/message-to-AI.dto';

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
        issueId: data.issueId,
        authorId: data.authorId,
      });
    } else if (issue.isClosed) {
      issue = await this.issuesService.save({
        issueId: data.issueId,
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
      const issueMessages =
        issue.messages && issue.messages.length > 0
          ? [...issue.messages, message]
          : [message];

      console.log(issueMessages);

      const context = issueMessages.map(
        (message) =>
          new MessageToAIDto(
            message.authorId == '0' ? 'assistant' : 'user',
            message.text,
          ),
      );

      const sendLastOrContext = context.reduce((prev, currentValue) => {
        return prev + currentValue.role == 'user' ? 1 : -1;
      }, 0);

      const answerFromAI = await this.fileService.getInstructionsFromFiles(
        sendLastOrContext > 1 ? [context[context.length - 1]] : context,
      );

      const isAnswer = !answerFromAI.instructions.every((answer) =>
        answer.text.toLowerCase().includes('нет фрагмента'),
      );

      const withPageAndLink = answerFromAI.instructions.filter(
        (answer) => !answer.text.toLowerCase().includes('нет фрагмента'),
      );

      // const text = withPageAndLink.reduce(
      //   (previousValue, currentValue) => previousValue + `${currentValue.text}`,
      //   '',
      // );

      const messageFromAI = await this.messageService.save({
        issueId: issue.issueId,
        text: isAnswer
          ? answerFromAI.answer
          : 'К сожалению, не могу ответить на ваш вопрос. Переключаю на оператора техподдержки.',
        authorId: '0',
        page:
          isAnswer && withPageAndLink.length > 0
            ? withPageAndLink.map((msg) => msg.page).join('$')
            : null,
        document:
          isAnswer && withPageAndLink.length > 0
            ? withPageAndLink.map((msg) => msg.filename).join('$')
            : undefined,
        isQuestion: false,
        documentOriginalNames:
          isAnswer && withPageAndLink.length > 0
            ? withPageAndLink.map((msg) => msg.originalName).join('$')
            : undefined,
      });

      const msg = await this.messageService.findOne({
        where: { id: messageFromAI.id },
      });

      console.log(msg);

      this.server
        .to(data.authorId)
        .emit('receiveMessage', new GetMessageRdo(msg));
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
