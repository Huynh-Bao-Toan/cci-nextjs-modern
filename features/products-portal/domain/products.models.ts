import { z } from "zod"

import { productSchema } from "./product.schemas"

export const sortOrderSchema = z.enum(["asc", "desc"])

export const productsSortBySchema = z.enum([
  "title",
  "price",
  "rating",
  "stock",
  "discountPercentage",
])

export type ProductsSortBy = z.infer<typeof productsSortBySchema>
export type SortOrder = z.infer<typeof sortOrderSchema>

export type PaginatedProducts = {
  items: Array<z.infer<typeof productSchema>>
  total: number
  page: number
  limit: number
  skip: number
}

export const productsSearchParamsSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sortBy: productsSortBySchema.optional(),
  sortOrder: sortOrderSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(5).max(50).default(12),
})

export type ProductsSearchParams = z.infer<typeof productsSearchParamsSchema>

