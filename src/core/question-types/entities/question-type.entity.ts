import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question_types')
export class QuestionType {
  @PrimaryGeneratedColumn('increment')
  readonly id: number;

  name: string;
}
