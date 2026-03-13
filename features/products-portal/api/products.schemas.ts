import { z } from "zod"

import { productsSearchParamsSchema } from "../domain/products.models"

export const rawProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  stock: z.number().optional(),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
})

export const rawProductsResponseSchema = z.object({
  products: z.array(rawProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

export const rawCategoriesResponseSchema = z.array(
  z.union([
    z.string(),
    z.object({
      slug: z.string(),
      name: z.string().optional(),
      url: z.string().optional(),
    }),
  ])
)

function emptyStringToUndefined(value: unknown) {
  if (typeof value !== "string") return value
  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}

export const createProductInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  price: z.coerce.number().finite().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  brand: z.preprocess(emptyStringToUndefined, z.string().trim().optional()),
  category: z.string().trim().min(1, "Category is required"),
  thumbnail: z.preprocess(emptyStringToUndefined, z.string().trim().url().optional()),
})

export const updateProductInputSchema = createProductInputSchema.partial()

export const productsSearchParamsInputSchema = productsSearchParamsSchema

