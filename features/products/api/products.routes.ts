import type { ProductId } from "../domain/product.types";
import type { ProductsSearchParams } from "../domain/products.models";

export const productsRoutes = {
  list: "/products",
  search: "/products/search",
  categories: "/products/categories",
  byId: (id: ProductId) => `/products/${id}`,
  byCategory: (category: string) =>
    `/products/category/${encodeURIComponent(category)}`,
} as const;

export function buildProductsListSearchParams(
  params: ProductsSearchParams,
): Record<string, string | number> {
  const searchParams: Record<string, string | number> = {
    limit: params.pageSize,
    skip: (params.page - 1) * params.pageSize,
  };
  return searchParams;
}

export function buildProductsSearchRequest(params: ProductsSearchParams): {
  path: string;
  searchParams: Record<string, string | number>;
  cache: RequestCache;
} {
  const searchParams = buildProductsListSearchParams(params);

  if (params.q) {
    return {
      path: productsRoutes.search,
      searchParams: { ...searchParams, q: params.q },
      cache: "no-store",
    };
  }

  if (params.category) {
    return {
      path: productsRoutes.byCategory(params.category),
      searchParams,
      cache: "force-cache",
    };
  }

  return {
    path: productsRoutes.list,
    searchParams,
    cache: "force-cache",
  };
}
