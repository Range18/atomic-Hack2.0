import { Module } from '@nestjs/common';
import { QuestionTypesController } from '#src/core/question-types/question-types.controller';
import { QuestionTypesService } from '#src/core/question-types/question-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionType } from '#src/core/question-types/entities/question-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionType])],
  controllers: [QuestionTypesController],
  providers: [QuestionTypesService],
  exports: [QuestionTypesService],
})
export class QuestionTypesModule {}
