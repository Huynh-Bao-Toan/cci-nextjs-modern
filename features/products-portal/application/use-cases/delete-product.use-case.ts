import type { ProductId } from "../../domain/product.types"
import { productIdSchema } from "../../domain/product.schemas"
import type { ProductsRepository } from "../ports/products.repository"

export async function deleteProductUseCase(
  repo: ProductsRepository,
  id: ProductId
): Promise<{ id: ProductId }> {
  const validId = productIdSchema.parse(id)
  return repo.deleteProduct(validId)
}

