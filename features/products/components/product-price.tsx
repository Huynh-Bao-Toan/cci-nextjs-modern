import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import type { Product } from "../api/products.types";
import {
  formatProductOriginalPrice,
  formatProductPrice,
} from "../lib/product-formatters";

type ProductPriceProps = {
  product: Product;
  className?: string;
};

export function ProductPrice({ product, className }: ProductPriceProps) {
  const price = formatProductPrice(product);
  const originalPrice = formatProductOriginalPrice(product);

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-lg font-semibold">{price}</span>
      {originalPrice ? (
        <span className="text-sm text-muted-foreground line-through">
          {originalPrice}
        </span>
      ) : null}
      {product.discountPercentage > 0 ? (
        <Badge variant="destructive">
          -{product.discountPercentage.toFixed(0)}%
        </Badge>
      ) : null}
    </div>
  );
}

