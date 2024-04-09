import "./Profile.scss";
import { Container, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Dish, User } from "../../models";
import { PlusCircle } from "react-bootstrap-icons";
import FmButton from "../../components/FmButton/FmButton";
import FmCard from "../../components/FmCard/FmCard";
import { useEffect, useState } from "react";
import usersService from "../../services/usersService";
import dishesService from "../../services/dishesService";
import FmTopNavBar from "../../components/FmTopNavBar/FmTopNavBar";
import Loader from "../../components/Loader/Loader";
import { CustomResponseError } from "../../models/error";
import { baseUrl } from "../../api/client";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const [ownDishes, setOwnDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);

    usersService
      .getUser()
      .then((data) => {
        setIsLoading(false);
        setUser(data);
      })
      .catch((err: CustomResponseError) => {
        if (err.status === 401) {
          sessionStorage.clear();
          navigate("/login", {
            state: { expiredToken: true },
          });
        } else {
          setIsLoading(false);
          console.error(err.message);
        }
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);

    dishesService
      .getOwnDishes()
      .then((data) => {
        setIsLoading(false);
        setOwnDishes(data);
      })
      .catch((err: CustomResponseError) => {
        if (err.status === 401) {
          sessionStorage.clear();
          navigate("/login", {
            state: { expiredToken: true },
          });
        } else {
          setIsLoading(false);
          console.error(err.message);
        }
      });
  }, [user]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Container>
      {isLoading && <Loader />}
      <div className="Profile contentWrapper">
        <FmTopNavBar />

        <div className="text-center">
          {user && (
            <img
              src={`${baseUrl}/${user.profileImagePath}`}
              className="rounded-circle profile-pic"
              alt="profile"
            />
          )}
        </div>

        <Stack
          direction="horizontal"
          className="justify-content-between align-items-center"
        >
          <h2 className="mb-0">Your own meals:</h2>
          <FmButton color="secondary" iconBtn onClick={() => navigate("/dish")}>
            <PlusCircle size={36} />
          </FmButton>
        </Stack>

        <div className="dishList">
          {ownDishes.map((dish) => (
            <FmCard
              dish={dish}
              key={dish.id}
              imgPos="left"
              onClick={() => navigate(`/dish/${dish.id}`)}
            />
          ))}
        </div>
        <FmButton color="primary" fixedBottomBtn onClick={() => logout()}>
          Logout
        </FmButton>
      </div>
    </Container>
  );
};

export default Profile;
