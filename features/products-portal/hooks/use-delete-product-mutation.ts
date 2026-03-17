"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ProductId } from "../domain/product.types"
import { deleteProduct } from "../composition/products.container"
import { productsKeys } from "../lib/products.keys"
import type { PaginatedProducts } from "../domain/products.models"

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: ProductId) => {
      await deleteProduct(id)
      return { id }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: productsKeys.all })
      const snapshots = queryClient.getQueriesData({ queryKey: productsKeys.all })

      queryClient.setQueriesData(
        { queryKey: productsKeys.all },
        (current): unknown => {
          if (!current || typeof current !== "object") return current
          const maybe = current as Partial<PaginatedProducts>
          if (!Array.isArray(maybe.items)) return current
          return {
            ...maybe,
            items: maybe.items.filter((p) => p.id !== id),
            total: typeof maybe.total === "number" ? Math.max(0, maybe.total - 1) : maybe.total,
          } satisfies Partial<PaginatedProducts>
        }
      )

      return { snapshots }
    },
    onError: (_err, _id, ctx) => {
      if (!ctx?.snapshots) return
      for (const [key, data] of ctx.snapshots) {
        queryClient.setQueryData(key, data)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}

