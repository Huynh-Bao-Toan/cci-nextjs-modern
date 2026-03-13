"use client";

import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

import { ProductCard } from "@/features/products/components/product-card";
import { useFavorites } from "@/features/products/hooks/use-favorites";

export default function FavoritesPage() {
  const { items, removeFavorite, clear } = useFavorites();

  const hasFavorites = items.length > 0;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading
          title="Favorites"
          subtitle="Products you have marked as favorites on this device."
        />
        {hasFavorites ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clear()}
          >
            Clear all
          </Button>
        ) : null}
      </div>

      {hasFavorites ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                title: item.title,
                price: item.price,
                rating: item.rating,
                brand: item.brand,
                category: item.category,
                thumbnailUrl: item.thumbnailUrl,
              }}
              footerSlot={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removeFavorite(item.id);
                  }}
                >
                  Remove
                </Button>
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites yet."
          description="Mark products as favorites from the catalog to see them here."
          action={
            <Link
              href="/products"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Browse products
            </Link>
          }
        />
      )}
    </main>
  );
}

