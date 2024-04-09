import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDecisionTree } from './entity/user-decision-tree.entity';

@Injectable()
export class UserDecisionTreeService {
  constructor(
    @InjectRepository(UserDecisionTree)
    private userDecisionTreeRepository: Repository<UserDecisionTree>,
  ) {}

  async findAll(): Promise<UserDecisionTree[]> {
    return this.userDecisionTreeRepository.find();
  }
}
