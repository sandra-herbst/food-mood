import "./FmTopNavBar.scss";
import React from "react";
import { useNavigate } from "react-router-dom";
import FmButton from "../FmButton/FmButton";
import { ChevronLeft } from "react-bootstrap-icons";

type TopNavBarProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

const FmTopNavBar = ({ children, onClick }: TopNavBarProps) => {
  const navigate = useNavigate();

  return (
    <div className="topNavBar">
      <div className="backBtn">
        <FmButton
          color="none"
          iconBtn={true}
          onClick={onClick ? onClick : () => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </FmButton>
      </div>

      {children}
    </div>
  );
};

export default FmTopNavBar;
