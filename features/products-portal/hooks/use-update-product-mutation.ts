"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { ProductId } from "../domain/product.types"
import type { UpdateProductInput } from "../domain/product.schemas"
import { updateProduct } from "../composition/products.container"
import { productsKeys } from "../lib/products.keys"

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: { id: ProductId; input: UpdateProductInput }) => {
      return updateProduct(variables.id, variables.input)
    },
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productsKeys.all }),
        queryClient.invalidateQueries({ queryKey: productsKeys.detail(variables.id) }),
      ])
    },
  })
}

