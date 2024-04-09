import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

afterEach(() => {
  cleanup();
});

test("renders correct message", () => {
  render(<ErrorMessage errorText="test" show />);
  const message = screen.getByTestId("error-message");
  expect(message.innerHTML).toBe("test");
});

test("shows message if show is true", () => {
  render(<ErrorMessage errorText="test" show />);
  const message = screen.getByTestId("error-message");
  expect(message).toBeVisible();
});

test("hides message if show is false", () => {
  render(<ErrorMessage errorText="test" show={false} />);
  const message = screen.getByTestId("error-message");
  expect(message).not.toBeVisible();
});
