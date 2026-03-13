"use client";

import { toast } from "sonner";

import type { Product } from "../domain/product.types";
import {
  FavoriteProduct,
  useFavoritesStore,
} from "../store/favorites.store";

function toFavoriteSnapshot(product: Product): FavoriteProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    thumbnailUrl: product.thumbnailUrl,
    rating: product.rating,
    brand: product.brand,
    category: product.category,
  };
}

export function useFavorites() {
  const items = useFavoritesStore((state) => state.items);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const clear = useFavoritesStore((state) => state.clear);

  const list = Object.values(items);

  const isFavorite = (id: number) => Boolean(items[id]);

  const toggleFromProduct = (product: Product) => {
    const snapshot = toFavoriteSnapshot(product);
    const alreadyFavorite = Boolean(items[product.id]);
    toggleFavorite(snapshot);
    toast(alreadyFavorite ? "Removed from favorites" : "Added to favorites", {
      description: snapshot.title,
    });
  };

  return {
    items: list,
    isFavorite,
    toggleFavorite: toggleFromProduct,
    removeFavorite,
    clear,
  };
}

