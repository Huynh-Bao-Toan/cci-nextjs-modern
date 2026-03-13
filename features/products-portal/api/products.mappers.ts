import type { Product } from "../domain/product.types"
import type { PaginatedProducts } from "../domain/products.models"
import { productSchema } from "../domain/product.schemas"

import type { RawProduct, RawProductsResponse } from "./products.types"
import { rawProductSchema, rawProductsResponseSchema } from "./products.schemas"

export function mapRawProduct(raw: RawProduct): Product {
  const parsed = rawProductSchema.parse(raw)

  return productSchema.parse({
    id: parsed.id,
    title: parsed.title,
    description: parsed.description ?? "",
    price: parsed.price,
    discountPercentage: parsed.discountPercentage ?? 0,
    rating: parsed.rating ?? 0,
    stock: parsed.stock ?? 0,
    brand: parsed.brand ?? "",
    category: parsed.category,
    thumbnailUrl: parsed.thumbnail,
    imageUrls: parsed.images ?? [],
    tags: parsed.tags ?? [],
  })
}

export function mapRawProductsResponse(
  raw: RawProductsResponse,
  requested: { page: number; limit: number }
): PaginatedProducts {
  const parsed = rawProductsResponseSchema.parse(raw)
  const items = parsed.products.map(mapRawProduct)

  return {
    items,
    total: parsed.total,
    page: requested.page,
    limit: parsed.limit,
    skip: parsed.skip,
  }
}

