import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Container, Form, FloatingLabel } from "react-bootstrap";
import "./DishDetails.scss";
import FmButton from "../../components/FmButton/FmButton";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { Dish } from "../../models";
import { ALL_DISH_TYPES, DishType } from "../../models/dishType";
import { ALL_DISH_LABELS, DishLabel } from "../../models/dishLabel";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import dishesService from "../../services/dishesService";
import FmTopNavBar from "../../components/FmTopNavBar/FmTopNavBar";
import Loader from "../../components/Loader/Loader";
import { CustomResponseError } from "../../models/error";
import { baseUrl } from "../../api/client";

const DishDetails = () => {
  const { id } = useParams();
  const allDishTypes = ALL_DISH_TYPES;
  const allDishLabels = ALL_DISH_LABELS;

  const navigate = useNavigate();
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [hintVisible, setHintVisible] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [originalDish, setOriginalDish] = useState<Dish>();
  const [dish, setDish] = useState<Dish>({
    id: 0,
    name: "",
    imagePath: "",
    dishTypes: [],
    labels: [],
  });

  useEffect(() => {
    if (id !== undefined) {
      setIsLoading(true);

      dishesService
        .getDish(Number(id))
        .then((dbDish) => {
          const currDish: Dish = {
            id: dbDish.id,
            name: dbDish.name,
            imagePath: dbDish.imagePath,
            labels: dbDish.labels,
            dishTypes: dbDish.dishTypes,
          };
          setIsLoading(false);
          setOriginalDish(currDish);
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
            setHintVisible(true);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (originalDish) setDish({ ...originalDish });
  }, [originalDish]);

  /**
   * Adds or removes a dishType from the dish state variable
   * @param type, the selected dishType
   */
  function toggleTypes(type: DishType) {
    const currentTypes = [...dish.dishTypes];
    if (dish.dishTypes.some((t) => t.name === type.name)) {
      const index = currentTypes?.findIndex((t) => t.id === type.id);
      currentTypes?.splice(index, 1);
    } else {
      currentTypes?.push(type);
    }
    setDish({ ...dish, dishTypes: currentTypes });
  }

  /**
   * Adds or removes a label from the dish state variable
   * @param label, the selected dish label
   */
  function toggleLabels(label: DishLabel) {
    if (dish.labels) {
      const currentLabels = [...dish.labels];
      if (dish.labels.some((l) => l.name === label.name)) {
        const index = currentLabels?.findIndex((l) => l.id === label.id);
        currentLabels?.splice(index, 1);
      } else {
        currentLabels?.push(label);
      }
      setDish({ ...dish, labels: currentLabels });
    }
  }

  /**
   * Check if all required input fields are filled out
   * @returns Array<string> with the invalid fields
   */
  const validateInputFields = (): Array<string> => {
    const invalidFields = [];
    if (dish.name === "") {
      invalidFields.push("Name");
    }
    if (dish.imagePath === "") {
      invalidFields.push("Image");
    }
    if (dish.dishTypes.length === 0) {
      invalidFields.push("Types");
    }
    return invalidFields;
  };

  /**
   * Get the ids of the selected types or labels of a dish
   * @param labelOrTypeArray with the selected types or labels
   * @returns string with all ids
   */
  const getLabelAndTypeIds = (
    labelOrTypeArray: DishLabel[] | DishType[] | undefined
  ): string => {
    let result = "";
    if (labelOrTypeArray) {
      labelOrTypeArray.forEach((obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (key === "id") {
            result += `${value},`;
          }
        }
      });
    }
    result = result.substring(0, result.length - 1);
    return result;
  };

  /**
   * Check which dish values where changed
   * @returns FormData with all the changed values
   */
  const getChangedDishValues = (): FormData => {
    const result = new FormData();
    for (const [key, value] of Object.entries(dish)) {
      if (originalDish) {
        if (
          JSON.stringify(originalDish[key as keyof Dish]) !==
          JSON.stringify(value)
        ) {
          if (key === "dishTypes" || key === "labels") {
            const idString = getLabelAndTypeIds(value);
            result.append(key, idString);
          } else {
            result.append(key, value);
          }
        }
      }
    }
    return result;
  };

  /**
   * Creates FormData with the new dish values and sends them to the database
   * @returns response from the database
   */
  const addDish = async () => {
    const parameters = new FormData();
    parameters.append("name", dish.name);
    if (uploadedImage) {
      parameters.append("file", uploadedImage);
    }
    parameters.append("dishTypes", getLabelAndTypeIds(dish.dishTypes));
    if (dish.labels?.length !== 0) {
      parameters.append("labels", getLabelAndTypeIds(dish.labels));
    }

    return dishesService.addDish(parameters);
  };

  /**
   * Saves a new dish to the database or updates a dish in the database. Redirects user to last page or displays error message
   * @param e, formEvent that triggers call to database
   */
  const saveDish = (e: FormEvent) => {
    e.preventDefault();
    setHintVisible(false);
    const invalidFields = validateInputFields();
    if (invalidFields.length === 0) {
      if (id !== undefined) {
        const changedValues = getChangedDishValues();
        if (changedValues) {
          setIsLoading(true);

          dishesService
            .updateDish(Number(id), changedValues)
            .then(() => {
              setIsLoading(false);
              navigate(-1);
            })
            .catch((err: CustomResponseError) => {
              if (err.status === 401) {
                sessionStorage.clear();
                navigate("/login", {
                  state: { expiredToken: true },
                });
              } else if (err.status === 422) {
                setIsLoading(false);
                setErrorMessageText("A dish with this name already exists.");
                setHintVisible(true);
              } else {
                setIsLoading(false);
                setErrorMessageText(err.message);
                setHintVisible(true);
              }
            });
        }
      } else {
        setIsLoading(true);

        addDish()
          .then(() => {
            setIsLoading(false);
            navigate(-1);
          })
          .catch((err: CustomResponseError) => {
            if (err.status === 401) {
              sessionStorage.clear();
              navigate("/login", {
                state: { expiredToken: true },
              });
            } else if (err.status === 422) {
              setIsLoading(false);
              setErrorMessageText("A dish with this name already exists.");
              setHintVisible(true);
            } else {
              setIsLoading(false);
              setErrorMessageText(err.message);
              setHintVisible(true);
            }
          });
      }
    } else {
      setErrorMessageText(`${invalidFields.join(", ")} cannot be empty`);
      setHintVisible(true);
    }
  };

  /**
   * Delete dish from database. Redirects user to last page or display error message
   */
  const deleteDish = () => {
    setIsLoading(true);

    dishesService
      .deleteDish(Number(id))
      .then(() => {
        navigate(-1);
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
          setHintVisible(true);
        }
      });
  };

  /**
   * Click on hidden file input
   */
  const uploadImage = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  /**
   * Handle image upload and create temporary url to show image in UI
   * @param event, which triggered image upload
   */
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const imageFile = event.target.files[0];
      setUploadedImage(imageFile);
      setDish({ ...dish, imagePath: URL.createObjectURL(imageFile) });
    }
  };

  return (
    <Container>
      {isLoading && <Loader />}
      <div className="Dish contentWrapper">
        <FmTopNavBar>
          {id !== undefined && (
            <div className="deleteBtn">
              <FmButton
                color="none"
                iconBtn={true}
                onClick={() => deleteDish()}
              >
                <Trash size={20} />
              </FmButton>
            </div>
          )}
        </FmTopNavBar>
        <Form
          onSubmit={(event) => {
            saveDish(event);
          }}
        >
          <div className="dishBasics">
            <div className="dishImage">
              {dish.imagePath !== "" ? (
                <img
                  src={id ? `${baseUrl}/${dish.imagePath}` : dish.imagePath}
                  alt={dish.name}
                />
              ) : (
                <div className="imagePlaceholder">
                  <p>Upload Image</p>
                  <FmButton
                    color="secondary"
                    iconBtn
                    onClick={() => uploadImage()}
                  >
                    <PlusCircle size={28} />
                  </FmButton>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={hiddenFileInput}
                    onChange={(event) => handleFileUpload(event)}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>

            <div className="dishName">
              <FloatingLabel
                controlId="dish.InputName"
                label="Name"
                className="nameInput"
              >
                <Form.Control
                  type="text"
                  placeholder="Name"
                  maxLength={42}
                  value={dish.name}
                  onChange={(event) =>
                    setDish({ ...dish, name: event.target.value })
                  }
                />
              </FloatingLabel>
            </div>
          </div>
          <div className="detailsWrapper">
            <div className="dishDetails">
              <h2>Types:</h2>
              {allDishTypes.map((dishType) => (
                <div key={dishType.type.name}>
                  <Form.Check
                    type={"checkbox"}
                    id={`checkbox-${dishType.type.name}`}
                    checked={dish.dishTypes.some(
                      (t) => t.name === dishType.type.name
                    )}
                    onChange={() => toggleTypes(dishType.type)}
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
              <h2>Labels:</h2>
              {allDishLabels.map((dishLabel) => (
                <div key={dishLabel.label.name}>
                  <Form.Check
                    type={"checkbox"}
                    id={`checkbox-${dishLabel.label.id}`}
                    checked={dish.labels?.some(
                      (l) => l.name === dishLabel.label.name
                    )}
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
          <ErrorMessage errorText={errorMessageText} show={hintVisible} />
          <div className="saveBtnWrapper">
            <FmButton btnType={"submit"} color={"primary"}>
              Save
            </FmButton>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default DishDetails;
