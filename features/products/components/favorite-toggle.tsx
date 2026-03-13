"use client";

import { HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Product } from "../domain/product.types";
import { useFavorites } from "../hooks/use-favorites";

type FavoriteToggleProps = {
  product: Product;
  size?: "sm" | "default";
};

export function FavoriteToggle({
  product,
  size = "default",
}: FavoriteToggleProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(product.id);

  return (
    <Button
      type="button"
      variant={active ? "secondary" : "outline"}
      size={size === "sm" ? "icon-sm" : "icon"}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(product);
      }}
    >
      <HeartIcon
        className={active ? "fill-current" : undefined}
      />
    </Button>
  );
}

