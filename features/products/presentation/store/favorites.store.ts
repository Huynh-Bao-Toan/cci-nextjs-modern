"use client";

import "client-only";

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import type { Product } from "../../domain/product.types";

const isDev = process.env.NODE_ENV !== "production";

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
  devtools(
    persist(
      (set, get) => ({
        items: {},
        toggleFavorite(product) {
          const current = get().items;
          if (current[product.id]) {
            const next = { ...current };
            delete next[product.id];
            set({ items: next }, undefined, "favorites/toggleFavorite");
            return;
          }
          set(
            { items: { ...current, [product.id]: product } },
            undefined,
            "favorites/toggleFavorite",
          );
        },
        removeFavorite(id) {
          const current = get().items;
          if (!current[id]) return;
          const next = { ...current };
          delete next[id];
          set({ items: next }, undefined, "favorites/removeFavorite");
        },
        clear() {
          set({ items: {} }, undefined, "favorites/clear");
        },
      }),
      {
        name: "favorites-storage",
        storage: createJSONStorage(() => localStorage),
      },
    ),
    {
      name: "favorites-store",
      enabled: isDev,
    },
  ),
);
