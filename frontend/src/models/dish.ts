import { DishType } from "./dishType";
import { DishLabel } from "./dishLabel";

export interface Dish {
  id: number;
  name: string;
  imagePath: string;
  dishTypes: DishType[];
  labels?: DishLabel[];
}
