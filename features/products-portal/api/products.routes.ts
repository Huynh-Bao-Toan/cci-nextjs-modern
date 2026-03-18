import type { ProductId } from "../domain/product.types";
import { ProductsSearchParams } from "../domain/products.models";

export const productsRoutes = {
  list: "/products",
  search: "/products/search",
  categories: "/products/categories",
  byId: (id: ProductId) => `/products/${id}`,
  byCategory: (category: string) =>
    `/products/category/${encodeURIComponent(category)}`,
  create: "/products/add",
  update: (id: ProductId) => `/products/${id}`,
  remove: (id: ProductId) => `/products/${id}`,
} as const;

export function buildProductsListQueryParams(
  params: ProductsSearchParams,
): URLSearchParams {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(params.pageSize));
  searchParams.set("skip", String((params.page - 1) * params.pageSize));

  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("order", params.sortOrder);
  if (params.q) searchParams.set("q", params.q);

  return searchParams;
}

export function buildProductsSearchRequest(params: ProductsSearchParams): {
  path: string;
  params: URLSearchParams;
} {
  const query = buildProductsListQueryParams(params);

  if (params.q) {
    return { path: productsRoutes.search, params: query };
  }

  if (params.category) {
    query.delete("q");
    return { path: productsRoutes.byCategory(params.category), params: query };
  }

  query.delete("q");
  return { path: productsRoutes.list, params: query };
}
