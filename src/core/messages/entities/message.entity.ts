import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '#src/common/base.entity';
import { Issue } from '#src/core/issues/entities/issue.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'longtext', nullable: false })
  text: string;

  @Column({ nullable: false })
  authorId: string;

  @ManyToOne(() => Issue, (issue) => issue.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'issue' })
  issue: Issue;

  @Column({ nullable: false, default: false })
  isQuestion: boolean;

  @Column({ nullable: true })
  page?: string;

  @Column({ nullable: true })
  document?: string;

  @Column({ type: 'longtext', nullable: true })
  documentOriginalNames?: string;
}
