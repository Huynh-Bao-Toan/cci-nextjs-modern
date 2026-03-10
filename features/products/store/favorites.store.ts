"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Product } from "../api/products.types";

export type FavoriteProduct = Pick<
  Product,
  "id" | "title" | "price" | "thumbnailUrl" | "rating" | "brand" | "category"
>;

type FavoritesState = {
  items: Record<number, FavoriteProduct>;
};

type FavoritesActions = {
  toggleFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (id: number) => void;
  clear: () => void;
};

type FavoritesStore = FavoritesState & FavoritesActions;

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: {},
      toggleFavorite(product) {
        const current = get().items;
        if (current[product.id]) {
          const next = { ...current };
          delete next[product.id];
          set({ items: next });
          return;
        }
        set({ items: { ...current, [product.id]: product } });
      },
      removeFavorite(id) {
        const current = get().items;
        if (!current[id]) return;
        const next = { ...current };
        delete next[id];
        set({ items: next });
      },
      clear() {
        set({ items: {} });
      },
    }),
    {
      name: "mini-commerce:favorites",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

