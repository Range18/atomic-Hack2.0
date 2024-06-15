import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '#src/common/base.entity';
import { Message } from '#src/core/messages/entities/message.entity';

@Entity('issues')
export class Issue extends BaseEntity {
  @PrimaryColumn()
  readonly issueId: string;

  @Column({ nullable: false })
  authorId: string;

  @Column({ nullable: false, default: false })
  isClosed: boolean;

  @OneToMany(() => Message, (message) => message.issue, { nullable: true })
  messages?: Message[];
}
