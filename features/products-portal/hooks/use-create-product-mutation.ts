"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { CreateProductInput } from "../api/products.types"
import { createProduct } from "../api/products.endpoints"
import { mapRawProduct } from "../api/products.mappers"
import { productsKeys } from "../lib/products.keys"

export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const raw = await createProduct(input)
      return mapRawProduct(raw)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })
}

