import type { ProductsSearchParams } from "../../domain/products.models";
import { normalizeProductsSearchParams } from "./products.params";

export const productsKeys = {
  all: ["products-portal"] as const,
  categories: () => [...productsKeys.all, "categories"] as const,
  list: (params: ProductsSearchParams) =>
    [
      ...productsKeys.all,
      "list",
      normalizeProductsSearchParams(params),
    ] as const,
  detail: (id: number) => [...productsKeys.all, "detail", { id }] as const,
};
