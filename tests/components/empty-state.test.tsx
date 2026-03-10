import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";

import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No items" description="Try again later." />);

    expect(screen.getByText("No items")).toBeInTheDocument();
    expect(screen.getByText("Try again later.")).toBeInTheDocument();
  });
});

