import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDecision } from './entity/user-decision.entity';
import { UserDecisionService } from './user-decision.service';
import { UserDecisionTree } from './entity/user-decision-tree.entity';
import { UserDecisionTreeService } from './user-decision-tree.service';
import { UserDecisionTreeController } from './user-decision-tree.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserDecision, UserDecisionTree])],
  controllers: [UserDecisionTreeController],
  providers: [UserDecisionService, UserDecisionTreeService],
  exports: [UserDecisionService, UserDecisionTreeService],
})
export class UserDecisionModule {}
