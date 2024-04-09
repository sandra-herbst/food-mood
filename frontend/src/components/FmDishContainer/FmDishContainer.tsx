import React from "react";
import { Dish } from "../../models";
import FmCard from "../FmCard/FmCard";
import "./FmDishContainer.scss";
import { useNavigate } from "react-router-dom";

type DishContainerProps = {
  dishes: Dish[];
  children: React.ReactNode;
};

const FmDishContainer = ({ dishes, children }: DishContainerProps) => {
  const navigate = useNavigate();

  const navigateToDishDetails = (id: number) => {
    navigate(`/dish/${id}`);
  };

  return (
    <div className="dishContainer">
      {children}

      <div className="scrollingContainer">
        {dishes.map((dish) => (
          <FmCard
            dish={dish}
            key={dish.id}
            imgPos="top"
            size="md"
            onClick={() => navigateToDishDetails(dish.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FmDishContainer;
