import { describe, expect, it } from "vitest";

import {
  parseProductSearchParams,
  productSearchParamsSchema,
} from "@/features/products/presentation/lib/product.params";

describe("product search params", () => {
  it("applies defaults when params are missing", () => {
    const parsed = productSearchParamsSchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(12);
  });

  it("parses and coerces values from URL search params", () => {
    const parsed = parseProductSearchParams({
      q: "laptop",
      page: "2",
      pageSize: "24",
    });

    expect(parsed.q).toBe("laptop");
    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(24);
  });

  it("ignores unknown params", () => {
    const parsed = parseProductSearchParams({
      q: "phone",
      unknown: "value",
    });

    expect(parsed.q).toBe("phone");
  });
});
