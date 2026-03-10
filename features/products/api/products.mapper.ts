import type {
  PaginatedProducts,
  Product,
  RawProduct,
  RawProductsResponse,
} from "./products.types";
import { productsResponseSchema, productSchema } from "./products.schemas";

export function mapRawProduct(raw: RawProduct): Product {
  const parsed = productSchema.parse(raw);

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
  const parsed = productsResponseSchema.parse(raw);
  const items = parsed.products.map(mapRawProduct);
  const page = Math.floor(parsed.skip / parsed.limit) + 1;

  return {
    items,
    total: parsed.total,
    page,
    pageSize,
  };
}

