import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '#src/common/base.entity';

@Entity('files')
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  readonly id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  originalName: string;

  @Column({ nullable: false, default: false })
  isDocument: boolean;

  @Column({ nullable: false, default: 'text/plain' })
  mimeType: string;
}
