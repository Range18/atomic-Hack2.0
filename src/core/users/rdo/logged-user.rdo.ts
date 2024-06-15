import { Exclude } from 'class-transformer';

export class LoggedUserRdo {
  readonly accessToken: string;

  @Exclude()
  readonly sessionExpireAt: Date;

  readonly email: string;

  constructor(accessToken: string, sessionExpireAt: Date, email: string) {
    this.accessToken = accessToken;
    this.sessionExpireAt = sessionExpireAt;
    this.email = email;
  }
}
