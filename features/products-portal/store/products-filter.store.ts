"use client"

import "client-only"

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

const isDev = process.env.NODE_ENV !== "production"

type ProductsFilterState = {
  draftSearchText: string
}

type ProductsFilterActions = {
  setDraftSearchText: (value: string) => void
  resetDraft: () => void
}

type ProductsFilterStore = ProductsFilterState & ProductsFilterActions

const initialState: ProductsFilterState = {
  draftSearchText: "",
}

export const useProductsFilterStore = create<ProductsFilterStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setDraftSearchText(value) {
        set({ draftSearchText: value })
      },
      resetDraft() {
        set(initialState)
      },
    }),
    {
      name: "products-filter-store",
      enabled: isDev,
    }
  )
)

export function useProductsFilterDraft() {
  return useProductsFilterStore(
    useShallow((s) => ({
      draftSearchText: s.draftSearchText,
      setDraftSearchText: s.setDraftSearchText,
    }))
  )
}

