import { describe, expect, it } from "vitest"

import { mapRawProduct } from "@/features/products-portal/api/products.mappers"

describe("products-portal mappers", () => {
  it("maps raw product to domain product", () => {
    const mapped = mapRawProduct({
      id: 1,
      title: "Demo",
      description: "Desc",
      price: 10,
      discountPercentage: 5,
      rating: 4.5,
      stock: 12,
      brand: "Brand",
      category: "phones",
      thumbnail: "https://example.com/a.png",
      images: ["https://example.com/b.png"],
      tags: ["x"],
    })

    expect(mapped).toEqual({
      id: 1,
      title: "Demo",
      description: "Desc",
      price: 10,
      discountPercentage: 5,
      rating: 4.5,
      stock: 12,
      brand: "Brand",
      category: "phones",
      thumbnailUrl: "https://example.com/a.png",
      imageUrls: ["https://example.com/b.png"],
      tags: ["x"],
    })
  })

  it("fills optional raw fields with defaults", () => {
    const mapped = mapRawProduct({
      id: 2,
      title: "Demo 2",
      description: "",
      price: 0,
      category: "misc",
      thumbnail: "https://example.com/a.png",
    })

    expect(mapped.brand).toBe("")
    expect(mapped.discountPercentage).toBe(0)
    expect(mapped.rating).toBe(0)
    expect(mapped.stock).toBe(0)
    expect(mapped.imageUrls).toEqual([])
    expect(mapped.tags).toEqual([])
  })
})

