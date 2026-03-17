import { describe, expect, it } from "vitest";

import type { Product } from "@/features/products/domain/product.types";
import {
  formatProductOriginalPrice,
  formatProductPrice,
} from "@/features/products/presentation/lib/product-formatters";

const baseProduct: Product = {
  id: 1,
  title: "Test product",
  description: "",
  price: 100,
  discountPercentage: 20,
  rating: 4.5,
  stock: 10,
  brand: "Brand",
  category: "Category",
  thumbnailUrl: "https://example.com/image.jpg",
  imageUrls: [],
  tags: [],
};

describe("product formatters", () => {
  it("formats price as currency", () => {
    const formatted = formatProductPrice(baseProduct);
    expect(formatted).toContain("100");
  });

  it("derives original price from discount percentage", () => {
    const formatted = formatProductOriginalPrice(baseProduct);
    // Original price should be 125 given 20% off
    expect(formatted).toBeTruthy();
    expect(formatted).toContain("125");
  });

  it("returns null for original price when no discount", () => {
    const product: Product = { ...baseProduct, discountPercentage: 0 };
    const formatted = formatProductOriginalPrice(product);
    expect(formatted).toBeNull();
  });
});
