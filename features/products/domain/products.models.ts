import { z } from "zod";

import type { Product } from "./product.types";

export type PaginatedProducts = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
};

export const productsSearchParamsSchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type ProductsSearchParams = z.infer<typeof productsSearchParamsSchema>;
