import { z } from "zod"

export const productIdSchema = z.number().int().positive()

export const productSchema = z.object({
  id: productIdSchema,
  title: z.string().trim().min(1),
  description: z.string().trim().default(""),
  price: z.number().finite().nonnegative(),
  discountPercentage: z.number().finite().nonnegative().default(0),
  rating: z.number().finite().nonnegative().default(0),
  stock: z.number().finite().int().nonnegative().default(0),
  brand: z.string().trim().default(""),
  category: z.string().trim().min(1),
  thumbnailUrl: z.string().url(),
  imageUrls: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
})

export type ProductSchema = z.infer<typeof productSchema>

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
  thumbnail: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().url().optional()
  ),
})

export const updateProductInputSchema = createProductInputSchema.partial()

