"use client";

import { useQuery } from "@tanstack/react-query";

import type { ProductsSearchParams } from "../../domain/products.models";
import { productsQueries } from "../lib/products.queries";

export function useProductsQuery(params: ProductsSearchParams) {
  return useQuery({
    ...productsQueries.list(params),
    placeholderData: (previous) => previous,
  });
}
