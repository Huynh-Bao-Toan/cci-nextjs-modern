type ProductsHrefParams = {
  q?: string;
  category?: string;
  page: number;
  pageSize?: number;
};

export function buildProductsHref(params: ProductsHrefParams) {
  const url = new URL("/products", "http://localhost");
  if (params.q) url.searchParams.set("q", params.q);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.pageSize) {
    url.searchParams.set("pageSize", String(params.pageSize));
  }
  url.searchParams.set("page", String(params.page));
  return `${url.pathname}?${url.searchParams.toString()}`;
}

