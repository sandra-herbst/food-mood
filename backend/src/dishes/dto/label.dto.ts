import { Label } from '../entity/label.entity';

export class LabelRO {
  id: number;
  name: string;

  private static from(dto: Partial<LabelRO>): LabelRO {
    const it = new LabelRO();
    it.id = dto.id;
    it.name = dto.name;
    return it;
  }

  public static fromEntity(entity: Label): LabelRO {
    return this.from({
      id: entity.id,
      name: entity.name,
    });
  }
}
