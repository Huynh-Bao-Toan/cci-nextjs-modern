import { describe, expect, it } from "vitest"

import {
  normalizeProductsSearchParams,
  parseProductsSearchParams,
} from "@/features/products-portal/lib/products.params"

describe("products-portal params", () => {
  it("parses and normalizes search params", () => {
    const parsed = parseProductsSearchParams({
      q: "  iphone  ",
      page: "2",
      limit: "20",
      category: "",
    })

    expect(parsed).toEqual({
      q: "iphone",
      page: 2,
      limit: 20,
    })
  })

  it("normalizes empty strings to undefined", () => {
    expect(
      normalizeProductsSearchParams({
        q: " ",
        category: " ",
        sortBy: undefined,
        sortOrder: undefined,
        page: 1,
        limit: 12,
      })
    ).toEqual({
      page: 1,
      limit: 12,
    })
  })
})

