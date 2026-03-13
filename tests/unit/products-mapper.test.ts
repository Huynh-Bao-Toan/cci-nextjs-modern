import { describe, expect, it } from "vitest";

import type { RawProduct, RawProductsResponse } from "@/features/products/api/products.types";
import {
  mapRawProduct,
  mapRawProductsResponse,
} from "@/features/products/api/products.mapper";

const rawProduct: RawProduct = {
  id: 1,
  title: "Sample product",
  description: "A sample description",
  price: 50,
  discountPercentage: 10,
  rating: 4.2,
  stock: 5,
  brand: "Brand",
  category: "Category",
  thumbnail: "https://example.com/thumb.jpg",
  images: ["https://example.com/thumb.jpg"],
  tags: ["tag1", "tag2"],
};

describe("products mapper", () => {
  it("maps a raw product to domain product", () => {
    const mapped = mapRawProduct(rawProduct);

    expect(mapped.id).toBe(rawProduct.id);
    expect(mapped.thumbnailUrl).toBe(rawProduct.thumbnail);
    expect(mapped.imageUrls).toEqual(rawProduct.images);
    expect(mapped.tags).toEqual(rawProduct.tags);
  });

  it("maps raw products response to paginated products", () => {
    const response: RawProductsResponse = {
      products: [rawProduct],
      total: 10,
      skip: 0,
      limit: 12,
    };

    const paginated = mapRawProductsResponse(response, 12);

    expect(paginated.items).toHaveLength(1);
    expect(paginated.total).toBe(10);
    expect(paginated.page).toBe(1);
    expect(paginated.pageSize).toBe(12);
  });
});

