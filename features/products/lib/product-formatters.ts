import { formatCurrency } from "@/lib/utils/number";

type PriceSource = {
  price: number;
  discountPercentage?: number | null;
};

export function formatProductPrice(product: PriceSource): string {
  return formatCurrency(product.price);
}

export function formatProductOriginalPrice(
  product: PriceSource,
): string | null {
  if (!product.discountPercentage) return null;
  const original = product.price / (1 - product.discountPercentage / 100);
  return formatCurrency(original);
}

