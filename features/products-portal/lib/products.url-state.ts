"use client"

import "client-only"

import { parseAsInteger, parseAsString } from "nuqs"

import type { ProductsSearchParams } from "../domain/products.models"
import { productsSearchParamsSchema } from "../domain/products.models"
import { getDefaultProductsSearchParams, normalizeProductsSearchParams } from "./products.params"

export const productsUrlState = {
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  sortBy: parseAsString.withDefault(""),
  sortOrder: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(getDefaultProductsSearchParams().limit),
}

export type ProductsUrlState = {
  q: string
  category: string
  sortBy: string
  sortOrder: string
  page: number
  limit: number
}

export const PRODUCTS_URL_STATE_OPTS_FILTER = {
  history: "replace" as const,
  shallow: true as const,
  scroll: false as const,
}

export const PRODUCTS_URL_STATE_OPTS_PAGE = {
  history: "push" as const,
  shallow: true as const,
  scroll: false as const,
}

export const PRODUCTS_URL_STATE_OPTS_RESET = {
  history: "push" as const,
  shallow: true as const,
  scroll: false as const,
}

export function toProductsSearchParams(state: ProductsUrlState): ProductsSearchParams {
  const candidate = {
    q: state.q || undefined,
    category: state.category || undefined,
    sortBy: state.sortBy || undefined,
    sortOrder: state.sortOrder || undefined,
    page: state.page,
    limit: state.limit,
  }

  const parsed = productsSearchParamsSchema.safeParse(candidate)
  if (!parsed.success) return getDefaultProductsSearchParams()

  return normalizeProductsSearchParams(parsed.data)
}

