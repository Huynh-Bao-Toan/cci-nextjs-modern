import { cache } from "react";

import { httpGetJson } from "@/lib/api/http";

import type { RawCategoriesResponse } from "../api/products.types";
import { categoriesResponseSchema } from "../api/products.schemas";

export const getCategories = cache(async () => {
  const raw = await httpGetJson<RawCategoriesResponse>("/products/categories", {
    cache: "force-cache",
  });

  const parsed = categoriesResponseSchema.parse(raw);

  return parsed.map((item) =>
    typeof item === "string" ? item : item.slug ?? item.name ?? "",
  );
});

