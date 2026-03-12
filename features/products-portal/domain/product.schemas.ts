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

