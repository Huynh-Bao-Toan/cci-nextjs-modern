import { queryOptions } from "@tanstack/react-query";

import type { ProductsSearchParams } from "../../domain/products.models";
import type { PaginatedProducts } from "../../domain/products.models";
import type { Product } from "../../domain/product.types";

import {
  getCategories,
  getProductById,
  searchProducts,
} from "../../composition/products.container";
import { productsKeys } from "./products.keys";

export const productsQueries = {
  categories: () =>
    queryOptions({
      queryKey: productsKeys.categories(),
      queryFn: async () => {
        return getCategories();
      },
      staleTime: 60 * 60 * 1000,
    }),

  list: (params: ProductsSearchParams) =>
    queryOptions({
      queryKey: productsKeys.list(params),
      queryFn: async (): Promise<PaginatedProducts> => {
        return searchProducts(params);
      },
      staleTime: 15_000,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: productsKeys.detail(id),
      queryFn: async (): Promise<Product> => {
        // Not used by portal list yet; reserved for future.
        const product = await getProductById(id);
        if (!product) throw new Error("Product not found");
        return product;
      },
    }),
};
