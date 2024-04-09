import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDecision } from './entity/user-decision.entity';

@Injectable()
export class UserDecisionService {
  constructor(
    @InjectRepository(UserDecision)
    private userDecisionRepository: Repository<UserDecision>,
  ) {}

  async findAll(): Promise<UserDecision[]> {
    return this.userDecisionRepository.find();
  }
}
