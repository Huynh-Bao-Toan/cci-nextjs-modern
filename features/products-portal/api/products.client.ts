import {
  ApiClientError,
  apiClient,
  toApiClientError,
  type ApiError,
} from "@/lib/api/axios.client"

export class ProductsApiError extends ApiClientError {
  constructor(error: ApiError) {
    super(error)
    this.name = "ProductsApiError"
  }
}

export const productsApiClient = apiClient

export function toProductsApiError(error: unknown): ProductsApiError {
  const base = toApiClientError(error)
  return new ProductsApiError({ message: base.message, status: base.status })
}

