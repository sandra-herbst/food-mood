import axios from "axios";
import { getToken } from ".";

export const baseUrl = "http://localhost:5001";

const apiClient = axios.create({
  baseURL: `${baseUrl}/api`,
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken().access_token}`;
  return config;
});

export { apiClient };
