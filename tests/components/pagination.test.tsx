import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";

import { Pagination } from "@/components/shared/pagination";

describe("Pagination", () => {
  it("renders page information and links", () => {
    render(
      <Pagination
        page={2}
        pageSize={10}
        total={100}
        buildHref={(page) => `/products?page=${page}`}
      />,
    );

    const info = screen.getByText((_, node) => node?.textContent === "Page 2 of 10");
    expect(info).toBeDefined();

    const prev = screen.getByRole("link", { name: "Previous" });
    const next = screen.getByRole("link", { name: "Next" });

    expect(prev.getAttribute("href")).toMatch(/\/products\?page=1$/);
    expect(next.getAttribute("href")).toMatch(/\/products\?page=3$/);
  });
});

