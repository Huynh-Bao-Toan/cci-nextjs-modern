import type { Product, ProductId } from "../../domain/product.types"
import type { CreateProductInput, UpdateProductInput } from "../../domain/product.schemas"
import type { PaginatedProducts, ProductsSearchParams } from "../../domain/products.models"

export type ProductsRepository = {
  searchProducts(params: ProductsSearchParams): Promise<PaginatedProducts>
  getProductById(id: ProductId): Promise<Product | null>
  getCategories(): Promise<string[]>
  createProduct(input: CreateProductInput): Promise<Product>
  updateProduct(id: ProductId, input: UpdateProductInput): Promise<Product>
  deleteProduct(id: ProductId): Promise<{ id: ProductId }>
}

