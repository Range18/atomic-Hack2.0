import { UserEntity } from '#src/core/users/user.entity';

export class GetUserRdo {
  readonly id: string;

  readonly name: string;

  readonly email: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
  }
}
