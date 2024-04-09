import React from "react";
import "./ErrorMessage.scss";

interface ErrorMessageProps {
  errorText: string;
  show: boolean;
}

const ErrorMessage = ({ errorText, show }: ErrorMessageProps) => {
  return (
    <div
      className="errorContainer"
      data-cy="errorContainer"
      style={{ visibility: show ? "visible" : "hidden" }}
    >
      <p className="errorMessage" data-testid="error-message">
        {errorText}
      </p>
    </div>
  );
};

export default ErrorMessage;
