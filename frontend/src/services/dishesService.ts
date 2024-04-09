import { Dish } from "../models";
import { Rules } from "../models/rules";
import { CustomResponseError } from "../models/error";
import { apiClient } from "../api/client";

/**
 * Get a dish with a specific ID
 *
 * @param id numeric ID of a dish
 * @returns dish with the requested ID
 */
const getDish = async (id: number): Promise<Dish> => {
  let data: Dish = {
    id: 0,
    name: "",
    imagePath: "",
    dishTypes: [],
  };

  await apiClient
    .get(`/dishes/${id}`)
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      if (err.response) {
        const error = new Error() as CustomResponseError;
        error.status = err.response.status;
        error.message = err.response.data.message[0];
        throw error;
      } else {
        throw err;
      }
    });
  return data;
};

/**
 * Send request to add a new dish to the database
 *
 * @param params new dish data from a form
 */
const addDish = async (params: FormData) => {
  await apiClient.post("/dishes", params).catch((err) => {
    if (err.response) {
      const error = new Error() as CustomResponseError;
      error.status = err.response.status;
      error.message = err.response.data.message[0];
      throw error;
    } else {
      throw err;
    }
  });
};

/**
 * Send request to update a dish with a specific ID
 *
 * @param id numeric ID of a dish
 * @param params changed dish data from a form
 */
const updateDish = async (id: number, params: FormData) => {
  await apiClient.patch(`/dishes/${id}`, params).catch((err) => {
    if (err.response) {
      const error = new Error() as CustomResponseError;
      error.status = err.response.status;
      error.message = err.response.data.message[0];
      throw error;
    } else {
      throw err;
    }
  });
};

/**
 * Send request to delete a dish from the database
 *
 * @param id numeric ID of a dish
 */
const deleteDish = async (id: number) => {
  await apiClient.delete(`/dishes/${id}`).catch((err) => {
    if (err.response) {
      const error = new Error() as CustomResponseError;
      error.status = err.response.status;
      error.message = err.response.data.message[0];
      throw error;
    } else {
      throw err;
    }
  });
};

/**
 * Gets an array of random dishes, following a specific set of rules
 *
 * @param rules includes search parameters rounds, dishtype and optionally labels
 * @returns array of dishes found for the given parameters
 */
const getRandomDishes = async (rules: Rules): Promise<Dish[]> => {
  let data: Dish[] = [];

  await apiClient
    .get(
      rules.labels?.length
        ? `/dishes/random?labels=${rules.labels?.toString()}&dishType=${
            rules.type
          }&limit=${rules.rounds * 2}`
        : `/dishes/random?&dishType=${rules.type}&limit=${rules.rounds * 2}`
    )
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      if (err.response) {
        const error = new Error() as CustomResponseError;
        error.status = err.response.status;
        error.message = err.response.data.message[0];
        throw error;
      } else {
        throw err;
      }
    });
  return data;
};

/**
 * Get an array of dishes belonging to the logged in user
 *
 * @returns array of dishes found for the given parameters
 */
const getOwnDishes = async (): Promise<Dish[]> => {
  const userId = sessionStorage.getItem("UserId");
  let data: Dish[] = [];

  await apiClient
    .get(`/dishes?userId=${userId}`)
    .then((response) => {
      data = response.data;
    })
    .catch((err) => {
      if (err.response) {
        const error = new Error() as CustomResponseError;
        error.status = err.response.status;
        error.message = err.response.data.message[0];
        throw error;
      } else {
        throw err;
      }
    });
  return data;
};

const dishesService = {
  getDish,
  addDish,
  updateDish,
  deleteDish,
  getRandomDishes,
  getOwnDishes,
};

export default dishesService;
