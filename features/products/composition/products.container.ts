import { ProductsHttpRepository } from "../adapters/products-http.repository";
import { getCategoriesUseCase } from "../application/use-cases/get-categories.use-case";
import { getProductDetailUseCase } from "../application/use-cases/get-product-detail.use-case";
import { getRelatedProductsUseCase } from "../application/use-cases/get-related-products.use-case";
import { searchProductsUseCase } from "../application/use-cases/search-products.use-case";
import type { ProductsSearchParams } from "../domain/products.models";
import type { ProductId } from "../domain/product.types";

const productsRepository = new ProductsHttpRepository();

export function getCategories() {
  return getCategoriesUseCase(productsRepository);
}

export function searchProducts(params: ProductsSearchParams) {
  return searchProductsUseCase(productsRepository, params);
}

export function getProductDetail(id: ProductId) {
  return getProductDetailUseCase(productsRepository, id);
}

export function getRelatedProducts(category: string, currentId: ProductId) {
  return getRelatedProductsUseCase(productsRepository, category, currentId);
}
