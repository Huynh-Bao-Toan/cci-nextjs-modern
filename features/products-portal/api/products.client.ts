import axios, { AxiosError } from "axios"

import { getDummyJsonBaseUrl } from "@/lib/api/env"

export type ApiError = {
  message: string
  status: number
}

export class ProductsApiError extends Error {
  readonly status: number

  constructor(error: ApiError) {
    super(error.message)
    this.name = "ProductsApiError"
    this.status = error.status
  }
}

export const productsApiClient = axios.create({
  baseURL: getDummyJsonBaseUrl(),
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
})

export function toProductsApiError(error: unknown): ProductsApiError {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<{ message?: string }>
    const status = ax.response?.status ?? 0
    const message =
      ax.response?.data?.message ??
      ax.message ??
      "Request failed. Please try again."
    return new ProductsApiError({ message, status })
  }

  if (error instanceof Error) {
    return new ProductsApiError({ message: error.message, status: 0 })
  }

  return new ProductsApiError({
    message: "Unexpected error. Please try again.",
    status: 0,
  })
}

