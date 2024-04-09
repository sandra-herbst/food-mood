import "./Game.scss";
import { Container, Modal } from "react-bootstrap";
import FmCard from "../../components/FmCard/FmCard";
import FmButton from "../../components/FmButton/FmButton";
import { Dish } from "../../models";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FmTopNavBar from "../../components/FmTopNavBar/FmTopNavBar";
import { baseUrl } from "../../api/client";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dishesInGame, setDishesInGame] = useState<Dish[]>(
    location.state?.dishes
  );
  const [choices, setChoices] = useState<Dish[]>([]);
  const [currentChoice, setCurrentChoice] = useState<Dish>();
  const totalRounds: number = location.state && location.state.rounds;
  const [round, setRound] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);

  /**
   * Get a custom amount of randomized dishes from an array without duplicates
   *
   * @param arr array of dishes to pick from
   * @param numberOfDishes number of dishes to pick
   * @returns array of random dishes, length according to numberOfDishes
   */
  const getRandomDishes = (
    arr: Array<Dish>,
    numberOfDishes: number
  ): Array<Dish> => {
    const result: Array<Dish> = new Array<Dish>(numberOfDishes);
    let length: number = arr.length;
    const takenIndexes: Array<number> = new Array<number>(length);
    if (numberOfDishes > length)
      throw new RangeError("getRandom: more elements taken than available");
    while (numberOfDishes--) {
      const index = Math.floor(Math.random() * length);
      result[numberOfDishes] =
        arr[index in takenIndexes ? takenIndexes[index] : index];
      takenIndexes[index] =
        --length in takenIndexes ? takenIndexes[length] : length;
    }
    return result;
  };

  /**
   * Removes dishes in choices from an array if they exist
   *
   * @param arr array of dishes to delete from
   * @returns array with the dishes removed
   */
  const deleteChosenDishes = (arr: Array<Dish>): Array<Dish> => {
    const result = [...arr];
    for (let i = 0; i < choices.length; i++) {
      if (result?.some((c) => c.id === choices[i].id)) {
        const index = result?.findIndex((c) => c.id === choices[i].id);
        result?.splice(index, 1);
      }
    }
    return result;
  };

  /**
   * Replaces the dish that isn't the current choice with a new random dish
   *
   * @param arr array to replace a dish from
   * @returns array with dish replaced
   */
  const replaceNotChosen = (arr: Array<Dish>): Array<Dish> => {
    const result = [...arr];
    const index: number = result.findIndex((c) => c.id !== currentChoice?.id);

    try {
      result[index] = getRandomDishes(dishesInGame, 1)[0];
    } catch (e) {
      console.error(e);
      navigate("/");
    }
    return result;
  };

  const onCardClick = (dish: Dish) => {
    setCurrentChoice(dish);
    setRound((prev) => prev + 1);
  };

  const handleBack = () => {
    if (showModal) setShowModal(false);
    navigate("/");
  };

  useEffect(() => {
    if (!location.state?.dishes) {
      return navigate("/rules");
    }
    try {
      setChoices(getRandomDishes(location.state?.dishes, 2));
    } catch (e) {
      console.error(e);
      navigate("/");
    }
  }, []);

  useEffect(() => {
    setDishesInGame((prev) => deleteChosenDishes(prev));

    if (choices.length && choices[0]?.id === choices[1]?.id) {
      setChoices((prev) => {
        const result: Array<Dish> = [...prev];

        result[0] = getRandomDishes(dishesInGame, 1)[0];

        return result;
      });
    }
  }, [choices]);

  useEffect(() => {
    if (round !== totalRounds + 1) setChoices((prev) => replaceNotChosen(prev));
  }, [currentChoice, round]);

  useEffect(() => {
    if (round >= totalRounds + 1) setShowModal(true);
  }, [round]);

  return (
    <>
      <h2 className="roundsCount">
        {`${round === totalRounds + 1 ? totalRounds : round}/${totalRounds}`}
      </h2>
      <h2 className="separator">OR</h2>
      {choices && (
        <Container>
          <div className="gameContainer contentWrapper">
            <FmTopNavBar onClick={() => handleBack()} />

            <div className="cardWrapper">
              {choices.map((choice, index) => (
                <FmCard
                  key={`choice-${index}`}
                  dish={choice}
                  imgPos={index % 2 ? "bottom" : "top"}
                  size="lg"
                  showIcons={false}
                  onClick={() => onCardClick(choice)}
                />
              ))}
            </div>
          </div>
        </Container>
      )}
      {currentChoice && (
        <Modal show={showModal} centered>
          <Modal.Header>
            <img
              src={`${baseUrl}/${currentChoice.imagePath}`}
              alt={currentChoice.name}
              className="modalImg"
            />
          </Modal.Header>
          <Modal.Body>
            <h2>Your meal for today:</h2>
            <p>{currentChoice.name}</p>
          </Modal.Body>
          <Modal.Footer>
            <FmButton color="primary" onClick={() => handleBack()}>
              Back
            </FmButton>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Game;
