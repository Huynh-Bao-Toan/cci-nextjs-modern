"use client"

import { useQuery } from "@tanstack/react-query"

import { productsQueries } from "../lib/products.queries"

export function useCategoriesQuery() {
  return useQuery(productsQueries.categories())
}

