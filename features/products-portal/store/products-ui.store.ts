"use client"

import "client-only"

import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { ProductId } from "../domain/product.types"

export type ProductsViewMode = "table" | "compact"

const isDev = process.env.NODE_ENV !== "production"

type ProductsUiState = {
  isAddDialogOpen: boolean
  editingProductId: ProductId | null
  deletingProductId: ProductId | null
  selectedProductIds: Record<ProductId, true>
  viewMode: ProductsViewMode
}

type ProductsUiActions = {
  openAddDialog: () => void
  closeAddDialog: () => void
  openEditDialog: (id: ProductId) => void
  closeEditDialog: () => void
  openDeleteDialog: (id: ProductId) => void
  closeDeleteDialog: () => void
  toggleSelected: (id: ProductId) => void
  clearSelection: () => void
  setViewMode: (mode: ProductsViewMode) => void
}

type ProductsUiStore = ProductsUiState & ProductsUiActions

const initialState: ProductsUiState = {
  isAddDialogOpen: false,
  editingProductId: null,
  deletingProductId: null,
  selectedProductIds: {},
  viewMode: "table",
}

export const useProductsUiStore = create<ProductsUiStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      openAddDialog() {
        set({ isAddDialogOpen: true })
      },
      closeAddDialog() {
        set({ isAddDialogOpen: false })
      },
      openEditDialog(id) {
        set({ editingProductId: id })
      },
      closeEditDialog() {
        set({ editingProductId: null })
      },
      openDeleteDialog(id) {
        set({ deletingProductId: id })
      },
      closeDeleteDialog() {
        set({ deletingProductId: null })
      },
      toggleSelected(id) {
        const current = get().selectedProductIds
        if (current[id]) {
          const next = { ...current }
          delete next[id]
          set({ selectedProductIds: next })
          return
        }
        set({ selectedProductIds: { ...current, [id]: true } })
      },
      clearSelection() {
        set({ selectedProductIds: {} })
      },
      setViewMode(mode) {
        set({ viewMode: mode })
      },
    }),
    {
      name: "products-ui-store",
      enabled: isDev,
    }
  )
)

export function useProductsUiDialogs() {
  return useProductsUiStore((s) => ({
    isAddDialogOpen: s.isAddDialogOpen,
    editingProductId: s.editingProductId,
    deletingProductId: s.deletingProductId,
    openAddDialog: s.openAddDialog,
    closeAddDialog: s.closeAddDialog,
    openEditDialog: s.openEditDialog,
    closeEditDialog: s.closeEditDialog,
    openDeleteDialog: s.openDeleteDialog,
    closeDeleteDialog: s.closeDeleteDialog,
  }))
}

