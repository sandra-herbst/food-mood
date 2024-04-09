import "./GameRules.scss";
import { Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FmButton from "../../components/FmButton/FmButton";
import { ALL_DISH_TYPES } from "../../models/dishType";
import { ALL_DISH_LABELS, DishLabel } from "../../models/dishLabel";
import { Rules } from "../../models/rules";
import { FormEvent, useState } from "react";
import dishesService from "../../services/dishesService";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import FmTopNavBar from "../../components/FmTopNavBar/FmTopNavBar";
import Loader from "../../components/Loader/Loader";
import { CustomResponseError } from "../../models/error";

const GameRules = () => {
  const navigate = useNavigate();
  const allDishTypes = ALL_DISH_TYPES;
  const allDishLabels = ALL_DISH_LABELS;
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMessageText, setErrorMessageText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [rules, setRules] = useState<Rules>({
    rounds: 5,
    type: 1,
    labels: [],
  });

  /**
   * Get random dishes according to the game rules and check if enough dishes where found for the selected number of rounds.
   * Redirect user to game or display hint to change game rules
   * @param event, that triggered the call to the database
   */
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    dishesService
      .getRandomDishes(rules)
      .then((data) => {
        setIsLoading(false);
        if (data.length >= rules.rounds * 2) {
          setShowHint(false);
          return navigate("/game", {
            state: { dishes: data, rounds: rules.rounds },
          });
        } else {
          setErrorMessageText(
            "Not enough dishes found for these parameters. Try filtering differently."
          );
          return setShowHint(true);
        }
      })
      .catch((err: CustomResponseError) => {
        if (err.status === 401) {
          sessionStorage.clear();
          navigate("/login", {
            state: { expiredToken: true },
          });
        } else {
          setIsLoading(false);
          setErrorMessageText(err.message);
          setShowHint(true);
        }
      });
  };

  /**
   * Adds or removes labels from the rules
   *
   * @param label the dish label to be added or removed
   */
  const toggleLabels = (label: DishLabel) => {
    const currentLabels = rules.labels ? [...rules.labels] : [];

    if (rules.labels) {
      if (rules.labels.some((id) => id === label.id)) {
        const index = currentLabels?.findIndex((l) => l === label.id);
        currentLabels?.splice(index, 1);
      } else {
        currentLabels?.push(label.id);
      }
      setRules({ ...rules, labels: currentLabels });
    }
  };

  return (
    <Container>
      {isLoading && <Loader />}
      <div className="rulesContainer contentWrapper">
        <FmTopNavBar />

        <Form onSubmit={(e) => onSubmit(e)}>
          <h2 className="mb-0 roundsHeading">Rounds:</h2>
          <div className="roundsRadioGroup">
            {[5, 10, 20].map((roundCount, index) => (
              <div key={`round-count-${roundCount}`}>
                <Form.Check
                  type={"radio"}
                  name={"rounds"}
                  id={`radio-${roundCount}`}
                  onChange={() => setRules({ ...rules, rounds: roundCount })}
                  defaultChecked={index === 0}
                  label={<p className="roundsRadioButton">{roundCount}</p>}
                />
              </div>
            ))}
          </div>
          <div className="optionsWrapper">
            <div className="dishDetails">
              <h2 className="mb-0">Type:</h2>
              {allDishTypes.map((dishType, index) => (
                <div key={dishType.type.name}>
                  <Form.Check
                    type={"radio"}
                    name={"dishTypes"}
                    id={`radio-${dishType.type.id}`}
                    defaultChecked={index === 0}
                    onChange={() =>
                      setRules({ ...rules, type: dishType.type.id })
                    }
                    label={
                      <div className="dishCheckbox">
                        <img src={dishType.image} alt={dishType.type.name} />
                        <p>{dishType.type.name}</p>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
            <div className="dishDetails">
              <h2 className="mb-0">Categories:</h2>
              {allDishLabels.map((dishLabel) => (
                <div key={dishLabel.label.name}>
                  <Form.Check
                    type={"checkbox"}
                    name={"categories"}
                    id={`checkbox-${dishLabel.label.id}`}
                    onChange={() => toggleLabels(dishLabel.label)}
                    label={
                      <div className="dishCheckbox">
                        <img src={dishLabel.image} alt={dishLabel.label.name} />
                        <p>{dishLabel.label.name}</p>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <ErrorMessage errorText={errorMessageText} show={showHint} />
          <FmButton btnType="submit" color="primary" fixedBottomBtn>
            Start
          </FmButton>
        </Form>
      </div>
    </Container>
  );
};

export default GameRules;
