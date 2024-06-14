import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from '#src/core/issues/entities/issue.entity';
import { Message } from '#src/core/messages/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Message])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
