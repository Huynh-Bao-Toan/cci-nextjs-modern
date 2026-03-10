import { z } from "zod";

export const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  brand: z.string().optional().default(""),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).optional(),
});

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const categoriesResponseSchema = z.array(
  z.union([
    z.string(),
    z.object({
      slug: z.string(),
      name: z.string().optional(),
      url: z.string().optional(),
    }),
  ]),
);

export type ProductSchema = z.infer<typeof productSchema>;

