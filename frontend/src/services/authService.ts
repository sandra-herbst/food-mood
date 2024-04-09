import axios from "axios";
import { baseUrl } from "../api/client";
import { LoginData } from "../models";
import { CustomResponseError } from "../models/error";

/**
 * Validate login credentials
 * @param email string user input
 * @param password string user input
 * @returns LoginData containing user id and access token
 */
const login = async (email: string, password: string) => {
  let data: LoginData = {
    userId: -1,
    tokenData: {
      access_token: "",
      expires_in: -1,
    },
  };

  await axios
    .post(`${baseUrl}/api/auth/login`, JSON.stringify({ email, password }), {
      headers: { "Content-Type": "application/json" },
    })
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

const authService = {
  login,
};

export default authService;
