import { z } from "zod";

export const sortOptions = ["relevance", "price-asc", "price-desc", "rating-desc"] as const;

export const productSearchParamsSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  sort: z.enum(sortOptions).default("relevance"),
  minRating: z
    .coerce.number()
    .min(0)
    .max(5)
    .optional(),
});

export type ProductSearchParams = z.infer<typeof productSearchParamsSchema>;

export function parseProductSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): ProductSearchParams {
  const flattened: Record<string, string> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      if (value[0] != null) flattened[key] = value[0];
    } else if (value != null) {
      flattened[key] = value;
    }
  }

  return productSearchParamsSchema.parse(flattened);
}

