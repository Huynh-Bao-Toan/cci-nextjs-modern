import type { PaginatedProducts, ProductsSearchParams } from "../../domain/products.models"
import type { ProductsRepository } from "../ports/products.repository"

function normalizeSearchParams(params: ProductsSearchParams): ProductsSearchParams {
  const q = params.q?.trim()
  const category = params.category?.trim()
  const page = Number.isFinite(params.page) ? Math.max(1, Math.trunc(params.page)) : 1
  const pageSize = Number.isFinite(params.pageSize)
    ? Math.min(50, Math.max(5, Math.trunc(params.pageSize)))
    : 12

  return {
    q: q ? q : undefined,
    category: category ? category : undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortBy ? (params.sortOrder ?? "asc") : params.sortOrder,
    page,
    pageSize,
  }
}

export async function searchProductsUseCase(
  repo: ProductsRepository,
  params: ProductsSearchParams
): Promise<PaginatedProducts> {
  return repo.searchProducts(normalizeSearchParams(params))
}

