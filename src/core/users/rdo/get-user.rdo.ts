import { UserEntity } from '#src/core/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserRdo {
  @ApiProperty()
  readonly id: string;

  readonly name: string;

  @ApiProperty()
  readonly email: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
  }
}
