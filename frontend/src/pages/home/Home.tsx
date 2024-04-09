import "./Home.scss";
import { Dish, User } from "../../models";
import { Container } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import FmButton from "../../components/FmButton/FmButton";
import { PlusCircle } from "react-bootstrap-icons";
import { useNavigate, Link } from "react-router-dom";
import FmDishContainer from "../../components/FmDishContainer/FmDishContainer";
import { useEffect, useState } from "react";
import usersService from "../../services/usersService";
import dishesService from "../../services/dishesService";
import Loader from "../../components/Loader/Loader";
import { CustomResponseError } from "../../models/error";
import { baseUrl } from "../../api/client";

const Home = () => {
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

  return (
    <Container>
      {isLoading && <Loader />}
      <div className="Home contentWrapper">
        <div className="text-end">
          <Link to="/profile">
            {user && (
              <img
                src={`${baseUrl}/${user.profileImagePath}`}
                className="rounded-circle profile-pic"
                alt="profile"
                data-cy="profile-pic"
              />
            )}
          </Link>
        </div>

        <h1>
          Welcome back, <span data-cy="username">{user?.username}</span>
        </h1>

        {ownDishes && (
          <FmDishContainer dishes={ownDishes}>
            <Stack
              direction="horizontal"
              className="justify-content-between align-items-center"
            >
              <h2 className="mb-0">Your own meals:</h2>
              <FmButton
                color="secondary"
                iconBtn
                onClick={() => navigate("/dish")}
              >
                <PlusCircle size={28} />
              </FmButton>
            </Stack>
          </FmDishContainer>
        )}

        <FmButton
          color="primary"
          fixedBottomBtn
          onClick={() => navigate("/rules")}
        >
          Start
        </FmButton>
      </div>
    </Container>
  );
};

export default Home;
