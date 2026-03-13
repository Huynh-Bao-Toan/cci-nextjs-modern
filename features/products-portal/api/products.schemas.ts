import { z } from "zod";

import { productsSearchParamsSchema } from "../domain/products.models";

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
});

export const rawProductsResponseSchema = z.object({
  products: z.array(rawProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const rawCategoriesResponseSchema = z.array(
  z.union([
    z.string(),
    z.object({
      slug: z.string(),
      name: z.string().optional(),
      url: z.string().optional(),
    }),
  ]),
);

export const productsSearchParamsInputSchema = productsSearchParamsSchema;
