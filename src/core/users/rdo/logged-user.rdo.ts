import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserRdo {
  @ApiProperty()
  readonly accessToken: string;

  @Exclude()
  readonly sessionExpireAt: Date;

  @ApiProperty()
  readonly email: string;

  constructor(accessToken: string, sessionExpireAt: Date, email: string) {
    this.accessToken = accessToken;
    this.sessionExpireAt = sessionExpireAt;
    this.email = email;
  }
}
