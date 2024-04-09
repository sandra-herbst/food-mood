import { UserRO } from '../../users/dto';
import { DishTypeRO } from './dish-type.dto';
import { LabelRO } from './label.dto';
import { Dish } from '../entity/dish.entity';

export class DishRO {
  id: number;
  name: string;
  imagePath: string;
  labels: LabelRO[];
  dishTypes: DishTypeRO[];
  user: UserRO;

  private static from(dto: Partial<DishRO>): DishRO {
    const it = new DishRO();
    it.id = dto.id;
    it.name = dto.name;
    it.imagePath = dto.imagePath;
    it.user = dto.user;
    it.labels = dto.labels;
    it.dishTypes = dto.dishTypes;
    return it;
  }

  public static fromEntity(entity: Dish): DishRO {
    return this.from({
      id: entity.id,
      name: entity.name,
      imagePath: entity.imagePath,
      user: UserRO.fromEntity(entity.user),
      labels: entity.labels.map((e) => LabelRO.fromEntity(e)),
      dishTypes: entity.dishTypes.map((e) => DishTypeRO.fromEntity(e)),
    });
  }
}
