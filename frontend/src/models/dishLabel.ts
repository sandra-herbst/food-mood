export type DishLabelName =
  | "No Dairy"
  | "No Eggs"
  | "No Fish"
  | "No Gluten"
  | "No Meat";

export interface DishLabel {
  id: number;
  name: DishLabelName;
}

interface CompleteDishLabel {
  label: DishLabel;
  image: string;
}

export const ALL_DISH_LABELS: CompleteDishLabel[] = [
  {
    label: { id: 1, name: "No Dairy" },
    image: "/images/icons/dishLabel-1.svg",
  },
  {
    label: { id: 2, name: "No Eggs" },
    image: "/images/icons/dishLabel-2.svg",
  },
  {
    label: { id: 3, name: "No Fish" },
    image: "/images/icons/dishLabel-3.svg",
  },
  {
    label: { id: 4, name: "No Gluten" },
    image: "/images/icons/dishLabel-4.svg",
  },
  {
    label: { id: 5, name: "No Meat" },
    image: "/images/icons/dishLabel-5.svg",
  },
];
