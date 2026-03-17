import type { CreateProductInput, UpdateProductInput } from "../domain/product.schemas"
import type { ProductId } from "../domain/product.types"
import type { ProductsSearchParams } from "../domain/products.models"
import { ProductsHttpRepository } from "../adapters/products-http.repository"

import { getCategoriesUseCase } from "../application/use-cases/get-categories.use-case"
import { searchProductsUseCase } from "../application/use-cases/search-products.use-case"
import { getProductDetailUseCase } from "../application/use-cases/get-product-detail.use-case"
import { createProductUseCase } from "../application/use-cases/create-product.use-case"
import { updateProductUseCase } from "../application/use-cases/update-product.use-case"
import { deleteProductUseCase } from "../application/use-cases/delete-product.use-case"

const productsRepository = new ProductsHttpRepository()

export function getCategories() {
  return getCategoriesUseCase(productsRepository)
}

export function searchProducts(params: ProductsSearchParams) {
  return searchProductsUseCase(productsRepository, params)
}

export function getProductById(id: ProductId) {
  return getProductDetailUseCase(productsRepository, id)
}

export function createProduct(input: CreateProductInput) {
  return createProductUseCase(productsRepository, input)
}

export function updateProduct(id: ProductId, input: UpdateProductInput) {
  return updateProductUseCase(productsRepository, id, input)
}

export function deleteProduct(id: ProductId) {
  return deleteProductUseCase(productsRepository, id)
}

