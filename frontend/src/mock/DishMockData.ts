import { Dish } from "../models";

export const pancakes: Dish = {
  id: 0,
  name: "Pancakes",
  imagePath: "images/samples/pancakes.jpeg",
  dishTypes: [
    { id: 1, name: "Breakfast" },
    { id: 2, name: "Lunch" },
    { id: 4, name: "Dessert" },
  ],
  labels: [
    { id: 3, name: "No Fish" },
    { id: 5, name: "No Meat" },
  ],
};
