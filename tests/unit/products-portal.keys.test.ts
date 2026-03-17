import { describe, expect, it } from "vitest";

import { productsKeys } from "@/features/products-portal/presentation/lib/products.keys";

describe("productsKeys", () => {
  it("normalizes list params in query key", () => {
    const key = productsKeys.list({
      q: "  hello ",
      category: "",
      sortBy: undefined,
      sortOrder: undefined,
      page: 1,
      limit: 12,
    });

    expect(key[0]).toBe("products-portal");
    expect(key[1]).toBe("list");
    expect(key[2]).toMatchObject({ q: "hello", page: 1, limit: 12 });
  });
});
