import { ProductCard } from "./product-card";

import type { Product } from "../../domain/product.types";

type ProductGridProps = {
  products: Product[];
  footerSlotForProduct?: (product: Product) => React.ReactNode;
};

export function ProductGrid({
  products,
  footerSlotForProduct,
}: ProductGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          footerSlot={footerSlotForProduct?.(product)}
        />
      ))}
    </div>
  );
}
