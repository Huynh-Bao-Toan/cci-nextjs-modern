"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CreateProductInput } from "../domain/product.schemas"
import { createProduct } from "../composition/products.container"
import { productsKeys } from "../lib/products.keys"

export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      return createProduct(input)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}

