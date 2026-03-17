import { productIdSchema, updateProductInputSchema, type UpdateProductInput } from "../../domain/product.schemas"
import type { Product, ProductId } from "../../domain/product.types"
import type { ProductsRepository } from "../ports/products.repository"

export async function updateProductUseCase(
  repo: ProductsRepository,
  id: ProductId,
  input: UpdateProductInput
): Promise<Product> {
  const validId = productIdSchema.parse(id)
  const validInput = updateProductInputSchema.parse(input)
  return repo.updateProduct(validId, validInput)
}

