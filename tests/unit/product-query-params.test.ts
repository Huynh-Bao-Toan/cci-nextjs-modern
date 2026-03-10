import { describe, expect, it } from "vitest";

import {
  parseProductSearchParams,
  productSearchParamsSchema,
} from "@/features/products/lib/product-query-params";

describe("product search params", () => {
  it("applies defaults when params are missing", () => {
    const parsed = productSearchParamsSchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(12);
    expect(parsed.sort).toBe("relevance");
  });

  it("parses and coerces values from URL search params", () => {
    const parsed = parseProductSearchParams({
      q: "laptop",
      page: "2",
      pageSize: "24",
      sort: "price-desc",
      minRating: "4",
    });

    expect(parsed.q).toBe("laptop");
    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(24);
    expect(parsed.sort).toBe("price-desc");
    expect(parsed.minRating).toBe(4);
  });

  it("ignores unknown params", () => {
    const parsed = parseProductSearchParams({
      q: "phone",
      unknown: "value",
    } as any);

    expect(parsed.q).toBe("phone");
  });
});

