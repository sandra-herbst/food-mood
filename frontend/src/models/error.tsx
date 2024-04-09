export interface CustomResponseError extends Error {
  status?: number;
}

export interface ErrorResponse {
  statusCode: number;
  message: Array<string>;
  error: string;
}
