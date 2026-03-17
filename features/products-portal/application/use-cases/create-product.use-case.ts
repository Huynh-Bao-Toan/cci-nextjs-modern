import { createProductInputSchema, type CreateProductInput } from "../../domain/product.schemas"
import type { Product } from "../../domain/product.types"
import type { ProductsRepository } from "../ports/products.repository"

export async function createProductUseCase(
  repo: ProductsRepository,
  input: CreateProductInput
): Promise<Product> {
  const validInput = createProductInputSchema.parse(input)
  return repo.createProduct(validInput)
}

