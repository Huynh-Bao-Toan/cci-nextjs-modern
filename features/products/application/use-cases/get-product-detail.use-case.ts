import { productIdSchema } from "../../domain/product.schemas";
import type { Product, ProductId } from "../../domain/product.types";
import type { ProductsRepository } from "../ports/products.repository";

export async function getProductDetailUseCase(
  repo: ProductsRepository,
  id: ProductId,
): Promise<Product | null> {
  const validId = productIdSchema.parse(id);
  return repo.getProductById(validId);
}
