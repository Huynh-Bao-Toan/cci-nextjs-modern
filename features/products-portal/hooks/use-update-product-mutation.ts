"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ProductId } from "../domain/product.types"
import type { UpdateProductInput } from "../api/products.types"
import { updateProduct } from "../api/products.endpoints"
import { mapRawProduct } from "../api/products.mappers"
import { productsKeys } from "../lib/products.keys"

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { id: ProductId; input: UpdateProductInput }) => {
      const raw = await updateProduct(variables.id, variables.input)
      return mapRawProduct(raw)
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productsKeys.all }),
        queryClient.invalidateQueries({ queryKey: productsKeys.detail(variables.id) }),
      ])
    },
  })
}

