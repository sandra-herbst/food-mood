import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { UserDecisionTreeService } from './user-decision-tree.service';
import { UserDecisionTree } from './entity/user-decision-tree.entity';

@ApiExcludeController()
@Controller('user-decision-trees')
@ApiTags('userDecisionTrees')
export class UserDecisionTreeController {
  constructor(private readonly userDecisionTreeService: UserDecisionTreeService) {}

  @Get()
  async findAll(): Promise<UserDecisionTree[]> {
    return await this.userDecisionTreeService.findAll();
  }
}
