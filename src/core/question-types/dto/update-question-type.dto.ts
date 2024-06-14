import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionTypeDto } from '#src/core/question-types/dto/create-question-type.dto';

export class UpdateQuestionTypeDto extends PartialType(CreateQuestionTypeDto) {}
