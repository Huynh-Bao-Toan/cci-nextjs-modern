import { queryOptions } from "@tanstack/react-query"

import type { ProductsSearchParams } from "../domain/products.models"
import type { PaginatedProducts } from "../domain/products.models"
import type { Product } from "../domain/product.types"

import { rawCategoriesResponseSchema } from "../api/products.schemas"
import { mapRawProduct, mapRawProductsResponse } from "../api/products.mappers"
import { getCategories, searchProducts } from "../api/products.endpoints"
import { productsKeys } from "./products.keys"

export const productsQueries = {
  categories: () =>
    queryOptions({
      queryKey: productsKeys.categories(),
      queryFn: async () => {
        const raw = await getCategories()
        const parsed = rawCategoriesResponseSchema.parse(raw)
        return parsed.map((item) =>
          typeof item === "string" ? item : item.slug ?? item.name ?? ""
        )
      },
      staleTime: 60 * 60 * 1000,
    }),

  list: (params: ProductsSearchParams) =>
    queryOptions({
      queryKey: productsKeys.list(params),
      queryFn: async (): Promise<PaginatedProducts> => {
        const raw = await searchProducts(params)
        return mapRawProductsResponse(raw, { page: params.page, limit: params.limit })
      },
      staleTime: 15_000,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: productsKeys.detail(id),
      queryFn: async (): Promise<Product> => {
        // Not used by portal list yet; reserved for future.
        const { getProductById } = await import("../api/products.endpoints")
        const raw = await getProductById(id)
        return mapRawProduct(raw)
      },
    }),
}

