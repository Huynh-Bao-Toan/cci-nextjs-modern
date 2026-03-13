import type { Product } from "../domain/product.types"

export type RawProduct = {
  id: number
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  category: string
  thumbnail: string
  images?: string[]
  tags?: string[]
}

export type RawProductsResponse = {
  products: RawProduct[]
  total: number
  skip: number
  limit: number
}

export type RawCategory =
  | string
  | {
      slug: string
      name?: string
      url?: string
    }

export type RawCategoriesResponse = RawCategory[]

export type CreateProductInput = {
  title: string
  description?: string
  price: number
  stock: number
  brand?: string
  category: string
  thumbnail?: string
}

export type UpdateProductInput = Partial<
  Pick<
    CreateProductInput,
    "title" | "description" | "price" | "stock" | "brand" | "category" | "thumbnail"
  >
>

export type ApiProduct = Product

