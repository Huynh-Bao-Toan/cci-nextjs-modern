import { formatCurrency } from "@/lib/utils/number";

import type { Product } from "../api/products.types";

export function formatProductPrice(product: Product): string {
  return formatCurrency(product.price);
}

export function formatProductOriginalPrice(product: Product): string | null {
  if (!product.discountPercentage) return null;
  const original = product.price / (1 - product.discountPercentage / 100);
  return formatCurrency(original);
}

