import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '#src/common/base-entity.service';
import { QuestionType } from '#src/core/question-types/entities/question-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionTypesService extends BaseEntityService<QuestionType> {
  constructor(
    @InjectRepository(QuestionType)
    private readonly questionRepository: Repository<QuestionType>,
  ) {
    super(questionRepository);
  }
}
