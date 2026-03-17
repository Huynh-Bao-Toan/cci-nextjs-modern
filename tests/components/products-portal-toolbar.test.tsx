import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const setUrlState = vi.fn();

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
}));

import { ProductsToolbar } from "@/features/products-portal/presentation/components/products-toolbar";

describe("ProductsToolbar", () => {
  beforeEach(() => {
    setUrlState.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces search and commits to URL state (replace)", async () => {
    render(
      <ProductsToolbar
        categories={["phones"]}
        urlState={{
          q: "",
          category: "",
          sortBy: "",
          sortOrder: "",
          page: 1,
          limit: 12,
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUrlState={setUrlState as any}
      />,
    );

    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: "ip" } });

    expect(setUrlState).not.toHaveBeenCalled();

    vi.advanceTimersByTime(400);

    expect(setUrlState).toHaveBeenCalled();
    const [payload, options] = setUrlState.mock.calls.at(-1) ?? [];
    expect(payload).toMatchObject({ q: "ip", page: 1 });
    expect(options).toMatchObject({ history: "replace", shallow: true });
  });
});
