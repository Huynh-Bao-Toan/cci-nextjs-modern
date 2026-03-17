import { z } from "zod";
import { omitBy } from "es-toolkit/object";
import { isNil } from "es-toolkit/predicate";

import type { ProductsSearchParams } from "../../domain/products.models";
import { productsSearchParamsSchema } from "../../domain/products.models";
import { PRODUCTS_DEFAULT_PARAMS } from "./products.constants";

type SearchParamsInput = Record<string, string | string[] | undefined>;

function flattenSearchParams(
  searchParams: SearchParamsInput,
): Record<string, string> {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      if (value[0] != null) flattened[key] = value[0];
    } else if (value != null) {
      flattened[key] = value;
    }
  }

  return flattened;
}

export function getDefaultProductsSearchParams(): ProductsSearchParams {
  return { ...PRODUCTS_DEFAULT_PARAMS };
}

export function parseProductsSearchParams(
  searchParams: SearchParamsInput,
): ProductsSearchParams | null {
  const flattened = flattenSearchParams(searchParams);

  const parsed = productsSearchParamsSchema.safeParse(flattened);
  if (!parsed.success) return null;

  return normalizeProductsSearchParams(parsed.data);
}

export function normalizeProductsSearchParams(
  input: ProductsSearchParams,
): ProductsSearchParams {
  const normalized: ProductsSearchParams = {
    q: input.q?.trim() ? input.q.trim() : undefined,
    category: input.category?.trim() ? input.category.trim() : undefined,
    sortBy: input.sortBy,
    sortOrder: input.sortOrder,
    page: input.page,
    pageSize: input.pageSize,
  };

  return omitBy(normalized, isNil) as unknown as ProductsSearchParams;
}

export const productsSearchParamsUrlSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});
