import type { ProductsSearchParams } from "../../domain/products.models";
import type { ProductsSortBy, SortOrder } from "../../domain/products.models";

export const PRODUCTS_DEFAULT_PARAMS: ProductsSearchParams = {
  q: undefined,
  category: undefined,
  sortBy: undefined,
  sortOrder: undefined,
  page: 1,
  pageSize: 12,
};

export const PRODUCTS_SORT_BY_OPTIONS: Array<{
  value: ProductsSortBy;
  label: string;
}> = [
  { value: "title", label: "Title" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
  { value: "stock", label: "Stock" },
  { value: "discountPercentage", label: "Discount" },
];

export const PRODUCTS_SORT_ORDER_OPTIONS: Array<{
  value: SortOrder;
  label: string;
}> = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];
