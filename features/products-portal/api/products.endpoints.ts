import type { ProductsSearchParams } from "../domain/products.models"
import type { ProductId } from "../domain/product.types"

import type {
  CreateProductInput,
  RawProduct,
  RawCategoriesResponse,
  RawProductsResponse,
  UpdateProductInput,
} from "./products.types"
import { productsApiClient, toProductsApiError } from "./products.client"

function buildListSearchParams(params: ProductsSearchParams) {
  const limit = params.pageSize
  const skip = (params.page - 1) * params.pageSize

  const searchParams = new URLSearchParams()
  searchParams.set("limit", String(limit))
  searchParams.set("skip", String(skip))

  if (params.sortBy) searchParams.set("sortBy", params.sortBy)
  if (params.sortOrder) searchParams.set("order", params.sortOrder)

  return { searchParams, limit, skip }
}

export async function searchProducts(
  params: ProductsSearchParams
): Promise<RawProductsResponse> {
  try {
    const { searchParams } = buildListSearchParams(params)

    if (params.q) {
      searchParams.set("q", params.q)
      const { data } = await productsApiClient.get<RawProductsResponse>(
        "/products/search",
        { params: searchParams }
      )
      return data
    }

    if (params.category) {
      const { data } = await productsApiClient.get<RawProductsResponse>(
        `/products/category/${encodeURIComponent(params.category)}`,
        { params: searchParams }
      )
      return data
    }

    const { data } = await productsApiClient.get<RawProductsResponse>(
      "/products",
      { params: searchParams }
    )
    return data
  } catch (error) {
    throw toProductsApiError(error)
  }
}

export async function getProductById(id: ProductId): Promise<RawProduct> {
  try {
    const { data } = await productsApiClient.get<RawProduct>(`/products/${id}`)
    return data
  } catch (error) {
    throw toProductsApiError(error)
  }
}

export async function getCategories(): Promise<RawCategoriesResponse> {
  try {
    const { data } = await productsApiClient.get<RawCategoriesResponse>(
      "/products/categories"
    )
    return data
  } catch (error) {
    throw toProductsApiError(error)
  }
}

export async function createProduct(input: CreateProductInput): Promise<RawProduct> {
  try {
    const { data } = await productsApiClient.post<RawProduct>(
      "/products/add",
      input
    )
    return data
  } catch (error) {
    throw toProductsApiError(error)
  }
}

export async function updateProduct(
  id: ProductId,
  input: UpdateProductInput
): Promise<RawProduct> {
  try {
    const { data } = await productsApiClient.put<RawProduct>(`/products/${id}`, input)
    return data
  } catch (error) {
    throw toProductsApiError(error)
  }
}

export async function deleteProduct(id: ProductId): Promise<{ id: ProductId }> {
  try {
    const { data } = await productsApiClient.delete<{ id: ProductId }>(
      `/products/${id}`
    )
    return data
  } catch (error) {
    throw toProductsApiError(error)
  }
}

