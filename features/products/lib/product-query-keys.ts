import type { PaginatedProducts, Product } from "../api/products.types";

export const productQueryKeys = {
  all: ["products"] as const,
  list: (params: {
    q?: string;
    category?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
    minRating?: number;
  }) => ["products", "list", params] as const,
  detail: (id: number | string) => ["products", "detail", { id }] as const,
  related: (id: number | string) => ["products", "related", { id }] as const,
  categories: () => ["products", "categories"] as const,
};

export type ProductListData = PaginatedProducts;
export type ProductDetailData = Product;

