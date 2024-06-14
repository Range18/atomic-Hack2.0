import { Body, Controller, Delete, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoggedUserRdo } from '../users/rdo/logged-user.rdo';
import { LoginUserDto } from '#src/core/users/dto/login-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: LoggedUserRdo })
  @Post('register')
  async registration(
    @Res({ passthrough: true }) response: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoggedUserRdo> {
    return await this.authService.register(createUserDto);
  }

  @ApiOkResponse({ type: LoggedUserRdo })
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoggedUserRdo> {
    const userRdo = await this.authService.login(loginUserDto);

    response.status(200);

    return userRdo;
  }

  @Delete('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Body('accessToken') accessToken: string,
  ): Promise<void> {
    await this.authService.logout(accessToken);
  }
}
