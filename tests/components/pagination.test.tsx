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

    expect(screen.getByText(/Page 2 of 10/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Previous" })).toHaveAttribute(
      "href",
      "/products?page=1",
    );
    expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute(
      "href",
      "/products?page=3",
    );
  });
});

