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

