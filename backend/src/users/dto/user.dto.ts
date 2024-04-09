import { User } from '../entity/user.entity';

export class UserRO {
  id: number;
  username: string;
  email: string;
  profileImagePath: string;

  private static from(dto: Partial<UserRO>): UserRO {
    const it = new UserRO();
    it.id = dto.id;
    it.username = dto.username;
    it.email = dto.email;
    it.profileImagePath = dto.profileImagePath;
    return it;
  }

  public static fromEntity(entity: User): UserRO {
    return this.from({
      id: entity.id,
      username: entity.username,
      email: entity.email,
      profileImagePath: entity.profileImagePath,
    });
  }
}
