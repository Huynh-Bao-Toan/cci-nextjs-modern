import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "../page";

test("hiển thị heading chính đúng nội dung", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "To get started, edit the page.tsx file.",
    }),
  ).toBeDefined();
});

test("hiển thị các link và button quan trọng", () => {
  render(<Home />);

  expect(screen.getAllByText("Templates").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Learning").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Deploy Now").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Documentation").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Button").length).toBeGreaterThan(0);
});
