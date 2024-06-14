import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetIssueRdo } from '#src/core/issues/rdo/get-issue.rdo';

@Controller('issues')
@ApiTags('Issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async create(@Body() createIssueDto: CreateIssueDto): Promise<GetIssueRdo> {
    const issue = await this.issuesService.save(createIssueDto);

    return new GetIssueRdo(
      await this.issuesService.findOne({
        where: { issueId: issue.issueId },
        relations: { messages: true },
      }),
    );
  }

  @Get()
  @ApiQuery({ name: 'authorId', type: String })
  async findAll(@Query('authorId') authorId: string): Promise<GetIssueRdo[]> {
    const issues = await this.issuesService.find({
      where: { authorId: authorId },
      relations: { messages: true },
      order: { createdAt: 'ASC', messages: { createdAt: 'ASC' } },
    });

    return issues.map((issue) => new GetIssueRdo(issue));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetIssueRdo> {
    return new GetIssueRdo(
      await this.issuesService.findOne({
        where: { issueId: id },
        relations: { messages: true },
      }),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<GetIssueRdo> {
    await this.issuesService.updateOne(
      { where: { issueId: id } },
      updateIssueDto,
    );

    return new GetIssueRdo(
      await this.issuesService.findOne({
        where: { issueId: id },
        relations: { messages: true },
      }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.issuesService.removeOne({ where: { issueId: id } });
  }
}
