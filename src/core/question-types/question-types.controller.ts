import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { QuestionTypesService } from '#src/core/question-types/question-types.service';
import { CreateQuestionTypeDto } from '#src/core/question-types/dto/create-question-type.dto';
import { UpdateQuestionTypeDto } from '#src/core/question-types/dto/update-question-type.dto';

@Controller('question-types')
@ApiTags('QuestionTypes')
export class QuestionTypesController {
  constructor(private readonly questionTypesService: QuestionTypesService) {}

  @Post()
  async create(@Body() createQuestionTypeDto: CreateQuestionTypeDto) {
    return await this.questionTypesService.save(createQuestionTypeDto);
  }

  @Get()
  async findAll() {
    return await this.questionTypesService.find({});
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.questionTypesService.findOne({ where: { id } });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateQuestionTypeDto: UpdateQuestionTypeDto,
  ) {
    return await this.questionTypesService.updateOne(
      { where: { id } },
      updateQuestionTypeDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.questionTypesService.removeOne({ where: { id } });
  }
}
