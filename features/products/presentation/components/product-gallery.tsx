"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

import type { Product } from "../../domain/product.types";

type ProductGalleryProps = {
  product: Product;
};

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.imageUrls.length
    ? product.imageUrls
    : [product.thumbnailUrl];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border bg-muted">
        <CardContent className="p-0">
          <Image
            src={images[selectedIndex]}
            alt={product.title}
            width={800}
            height={600}
            className="h-80 w-full object-contain"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
          />
        </CardContent>
      </Card>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto p-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative flex h-20 w-24 shrink-0 overflow-hidden rounded-xl border bg-muted transition-all hover:opacity-80",
                selectedIndex === index && "ring-2 ring-primary ring-offset-1",
              )}
            >
              <Image
                src={src}
                alt={`${product.title} thumbnail ${index + 1}`}
                width={100}
                height={80}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
