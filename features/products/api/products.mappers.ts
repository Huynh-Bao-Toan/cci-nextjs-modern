import type { PaginatedProducts } from "../domain/products.models";
import type { Product } from "../domain/product.types";
import {
  rawProductSchema,
  rawProductsResponseSchema,
} from "./products.schemas";
import type { RawProduct, RawProductsResponse } from "./products.types";

export function mapRawProduct(raw: RawProduct): Product {
  const parsed = rawProductSchema.parse(raw);

  return {
    id: parsed.id,
    title: parsed.title,
    description: parsed.description,
    price: parsed.price,
    discountPercentage: parsed.discountPercentage,
    rating: parsed.rating,
    stock: parsed.stock,
    brand: parsed.brand ?? "",
    category: parsed.category,
    thumbnailUrl: parsed.thumbnail,
    imageUrls: parsed.images,
    tags: parsed.tags ?? [],
  };
}

export function mapRawProductsResponse(
  raw: RawProductsResponse,
  pageSize: number,
): PaginatedProducts {
  const parsed = rawProductsResponseSchema.parse(raw);
  const items = parsed.products.map(mapRawProduct);
  const page = Math.floor(parsed.skip / parsed.limit) + 1;

  return {
    items,
    total: parsed.total,
    page,
    pageSize,
  };
}
