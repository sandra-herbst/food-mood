import Card from "react-bootstrap/Card";
import { Dish } from "../../models";
import "./FmCard.scss";
import classNames from "classnames";
import { baseUrl } from "../../api/client";

type CardProps = {
  dish: Dish;
  imgPos: "top" | "bottom" | "left";
  size?: "sm" | "md" | "lg";
  showIcons?: boolean;
  onClick?: () => void;
};

const FmCard = ({
  dish,
  imgPos,
  size,
  showIcons = true,
  onClick,
}: CardProps) => {
  return (
    <Card
      border="primary"
      className={classNames({
        imageBottom: imgPos === "bottom",
        imageLeft: imgPos === "left",
        sm: size === "sm",
        md: size === "md",
        lg: size === "lg",
      })}
      data-testid="card"
      onClick={onClick}
    >
      <Card.Img
        src={`${baseUrl}/${dish.imagePath}`}
        alt={dish.name}
        data-testid="card-img"
      />
      <Card.Body data-testid="card-body">
        <Card.Title data-testid="card-title">{dish.name}</Card.Title>

        {showIcons && (
          <div>
            <Card.Text data-testid="card-types">
              {dish.dishTypes.map((type) => (
                <img
                  key={type.id}
                  src={`images/icons/dishType-${type.id}.svg`}
                  alt={type.name}
                  data-testid={`dishType-${type.id}`}
                />
              ))}
            </Card.Text>

            <Card.Text data-testid="card-labels">
              {dish.labels &&
                dish.labels.map((label) => (
                  <img
                    key={label.id}
                    src={`images/icons/dishLabel-${label.id}.svg`}
                    alt={label.name}
                    data-testid={`dishLabel-${label.id}`}
                  />
                ))}
            </Card.Text>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FmCard;
