import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '#src/core/auth/auth.service';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  @Post('send')
  async sendMail(@Body() createMailDto: CreateMailDto) {
    await this.authService.register({
      authorId: createMailDto.authorId,
      email: createMailDto.email,
      name: createMailDto.name,
      password: Math.random().toString(36).slice(-8),
    });
    return await this.mailService.sendMail(createMailDto);
  }
}
