import React from "react";
import Button from "react-bootstrap/Button";
import "./FmButton.scss";

interface ButtonProps {
  color: "primary" | "secondary" | "none";
  children: React.ReactNode;
  iconBtn?: boolean;
  fixedBottomBtn?: boolean;
  btnType?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const FmButton = ({
  color,
  children,
  iconBtn,
  fixedBottomBtn,
  btnType,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      variant={color}
      type={btnType}
      className={`${color}FmBtn ${iconBtn ? "btnWithIcon" : ""} ${
        fixedBottomBtn ? "fixed-bottom" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default FmButton;
