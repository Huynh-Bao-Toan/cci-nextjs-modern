import Image from "next/image";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

import type { Product } from "../domain/product.types";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.imageUrls.length
    ? product.imageUrls
    : [product.thumbnailUrl];

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border bg-muted">
        <CardContent className="p-0">
          <Image
            src={images[0]}
            alt={product.title}
            width={800}
            height={600}
            className="h-80 w-full object-contain"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </CardContent>
      </Card>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.slice(1, 6).map((src, index) => (
            <Card
              key={src}
              className={cn(
                "relative flex h-20 w-24 shrink-0 overflow-hidden border bg-muted",
                index === 0 && "ring-2 ring-primary",
              )}
            >
              <CardContent className="p-0">
                <Image
                  src={src}
                  alt={product.title}
                  width={200}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
