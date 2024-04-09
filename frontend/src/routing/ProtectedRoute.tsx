import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../api";

const ProtectedRoute = (props: any) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    try {
      getToken();
      setIsLoggedIn(true);
    } catch (err) {
      setIsLoggedIn(false);
      sessionStorage.clear();
      return navigate("/login", {
        state: { expiredToken: true },
      });
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn]);

  return <React.Fragment>{isLoggedIn ? props.children : null}</React.Fragment>;
};
export default ProtectedRoute;
