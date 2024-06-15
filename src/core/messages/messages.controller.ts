import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetMessageRdo } from '#src/core/messages/rdo/get-message.rdo';

@Controller('messages')
@ApiTags('Messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.save({
      ...createMessageDto,
      issue: { issueId: createMessageDto.issueId },
    });
  }

  @ApiQuery({ name: 'authorId', type: String })
  @Get()
  async findAll(
    @Query('authorId') authorId?: string,
  ): Promise<GetMessageRdo[]> {
    const messages = await this.messagesService.find({
      where: { authorId: authorId },
      relations: { issue: true },
    });

    return messages.map((message) => new GetMessageRdo(message));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new GetMessageRdo(
      await this.messagesService.findOne({
        where: { id: id },
        relations: { issue: true },
      }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.messagesService.removeOne({ where: { id: id } });
  }
}
