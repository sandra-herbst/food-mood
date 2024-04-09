import { User } from "../models";
import { CustomResponseError } from "../models/error";
import { apiClient } from "../api/client";

/**
 * Get user from database
 * @returns Promise<User> containing id, username, email and profile picture
 */
const getUser = async (): Promise<User> => {
  const userId = sessionStorage.getItem("UserId");
  let data: User = {
    id: -1,
    username: "",
    email: "",
    profileImagePath: "",
  };

  await apiClient
    .get(`/users/${userId}`)
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

const usersService = {
  getUser,
};

export default usersService;
