import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";

import type { Product } from "@/features/products/domain/product.types";
import { ProductCard } from "@/features/products/presentation/components/product-card";

const product: Product = {
  id: 1,
  title: "Test product",
  description: "Description",
  price: 99,
  discountPercentage: 0,
  rating: 4.4,
  stock: 3,
  brand: "Brand",
  category: "Category",
  thumbnailUrl: "https://example.com/image.jpg",
  imageUrls: [],
  tags: [],
};

describe("ProductCard", () => {
  it("renders product title and price", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByText("Test product")).toBeDefined();
    expect(screen.getByText(/99/)).toBeDefined();
  });

  it("links to product detail page", () => {
    render(<ProductCard product={product} />);

    const link = screen
      .getAllByRole("link")
      .find((el) => (el.getAttribute("href") ?? "").endsWith("/products/1"));
    expect(link).toBeDefined();
  });
});
