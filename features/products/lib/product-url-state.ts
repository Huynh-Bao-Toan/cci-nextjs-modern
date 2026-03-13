import { parseAsInteger, parseAsString } from "nuqs";

export const productsUrlState = {
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export type ProductsUrlState = {
  q: string;
  category: string;
  page: number;
};

export const PRODUCTS_URL_STATE_OPTS_FILTER = {
  history: "replace" as const,
  shallow: false as const,
};

export const PRODUCTS_URL_STATE_OPTS_PAGE = {
  history: "push" as const,
  shallow: false as const,
};

export const PRODUCTS_URL_STATE_OPTS_RESET = {
  history: "push" as const,
  shallow: false as const,
};

