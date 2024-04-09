import { DishType } from '../entity/dish-type.entity';

export class DishTypeRO {
  id: number;
  name: string;

  private static from(dto: Partial<DishTypeRO>): DishTypeRO {
    const it = new DishTypeRO();
    it.id = dto.id;
    it.name = dto.name;
    return it;
  }

  public static fromEntity(entity: DishType): DishTypeRO {
    return this.from({
      id: entity.id,
      name: entity.name,
    });
  }
}
