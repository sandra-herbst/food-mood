import { AccessToken } from "../models";
import { CustomResponseError } from "../models/error";

/**
 * Get access token from session storage
 * @returns AccessToken or exception when no token in storage
 */
export const getToken = (): AccessToken => {
  const token: AccessToken = JSON.parse(
    sessionStorage.getItem("Token") as string
  );

  if (token) {
    return token;
  } else {
    const error = new Error() as CustomResponseError;
    error.status = 401;
    error.message = "Unauthorized";
    throw error;
  }
};
