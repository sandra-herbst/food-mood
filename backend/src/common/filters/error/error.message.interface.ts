/**
 * Interface for corresponding error message implementation.
 */
export interface IErrorMessage {
  /**
   * Method to get the message of an error.
   * @param exception, which occurred.
   * @returns String array containing the error messages.
   */
  getErrorMessage<T>(exception: T): string[];

  /**
   * Method to get the status code of an error.
   * @param exception, which occurred.
   * @returns Number containing the status code of the error.
   */
  getStatusCode<T>(exception: T): number;
}
