import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Label } from './entity/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  /**
   * Find all labels.
   */
  async findAll(): Promise<Label[]> {
    return this.labelRepository.find();
  }

  /**
   * Find a label by its id.
   * @param labelId of the label that should be searched for.
   */
  async findById(labelId: number): Promise<Label> {
    return await this.labelRepository.findOneOrFail({
      where: {
        id: labelId,
      },
    });
  }
}
