export type DishTypeName = "Breakfast" | "Lunch" | "Dinner" | "Dessert";

export interface DishType {
  id: number;
  name: DishTypeName;
}

interface CompleteDishType {
  type: DishType;
  image: string;
}

export const ALL_DISH_TYPES: CompleteDishType[] = [
  {
    type: { id: 1, name: "Breakfast" },
    image: "/images/icons/dishType-1.svg",
  },
  {
    type: { id: 2, name: "Lunch" },
    image: "/images/icons/dishType-2.svg",
  },
  {
    type: { id: 3, name: "Dinner" },
    image: "/images/icons/dishType-3.svg",
  },
  {
    type: { id: 4, name: "Dessert" },
    image: "/images/icons/dishType-4.svg",
  },
];
