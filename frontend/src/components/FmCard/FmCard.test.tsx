import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";
import FmCard from "./FmCard";
import { pancakes } from "../../mock/DishMockData";

afterEach(() => {
  cleanup();
});

test("renders dish name correctly", () => {
  render(<FmCard dish={pancakes} imgPos="top" />);
  const title = screen.getByTestId("card-title");
  expect(title.innerHTML).toBe("Pancakes");
});

test("renders dish type icons correctly", () => {
  render(<FmCard dish={pancakes} imgPos="top" />);
  const types = screen.getByTestId("card-types");
  expect(types.childElementCount).toBe(3);
  expect(screen.getByTestId("dishType-1")).toBeInTheDocument();
  expect(screen.getByTestId("dishType-2")).toBeInTheDocument();
  expect(screen.getByTestId("dishType-4")).toBeInTheDocument();
});

test("renders dish label icons correctly", () => {
  render(<FmCard dish={pancakes} imgPos="top" />);
  const labels = screen.getByTestId("card-labels");
  expect(labels.childElementCount).toBe(2);
  expect(screen.getByTestId("dishLabel-3")).toBeInTheDocument();
  expect(screen.getByTestId("dishLabel-5")).toBeInTheDocument();
});

test("renders no icons if showIcons is false", () => {
  render(<FmCard dish={pancakes} imgPos="top" showIcons={false} />);
  expect(screen.queryByTestId("card-types")).not.toBeInTheDocument();
  expect(screen.queryByTestId("card-labels")).not.toBeInTheDocument();
});
