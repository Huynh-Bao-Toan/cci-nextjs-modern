import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Product } from "../api/products.types";
import {
  formatProductPrice,
  formatProductOriginalPrice,
} from "../lib/product-formatters";

type ProductCardProps = {
  product: Product;
  footerSlot?: React.ReactNode;
  className?: string;
};

export function ProductCard({
  product,
  footerSlot,
  className,
}: ProductCardProps) {
  const price = formatProductPrice(product);
  const originalPrice = formatProductOriginalPrice(product);

  return (
    <Card
      className={cn(
        "overflow-hidden border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <Link
        href={`/products/${product.id}`}
        className="relative block overflow-hidden bg-muted"
      >
        <Image
          src={product.thumbnailUrl}
          alt={product.title}
          width={400}
          height={320}
          className="h-52 w-full object-contain transition group-hover:scale-[1.02]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        />
        {product.discountPercentage > 0 ? (
          <Badge className="absolute left-3 top-3" variant="destructive">
            -{product.discountPercentage.toFixed(0)}%
          </Badge>
        ) : null}
      </Link>
      <CardContent className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-2">
        <Link href={`/products/${product.id}`} className="space-y-1">
          <p className="line-clamp-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {product.brand || product.category}
          </p>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {product.title}
          </h3>
        </Link>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-foreground">{price}</span>
          {originalPrice ? (
            <span className="text-[11px] text-muted-foreground line-through">
              {originalPrice}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>⭐ {product.rating.toFixed(1)}</span>
          <span>{product.stock} in stock</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/products/${product.id}`}>View</Link>
          </Button>
          {footerSlot}
        </div>
      </CardContent>
    </Card>
  );
}
