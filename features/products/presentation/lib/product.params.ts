import {
  productsSearchParamsSchema,
  type ProductsSearchParams,
} from "../../domain/products.models";

export const productSearchParamsSchema = productsSearchParamsSchema;

export type ProductSearchParams = ProductsSearchParams;

export function parseProductSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProductSearchParams {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      if (value[0] != null) flattened[key] = value[0];
    } else if (value != null) {
      flattened[key] = value;
    }
  }

  return productSearchParamsSchema.parse(flattened);
}
