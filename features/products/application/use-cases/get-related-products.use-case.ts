import { productIdSchema } from "../../domain/product.schemas";
import type { Product, ProductId } from "../../domain/product.types";
import type { ProductsRepository } from "../ports/products.repository";

export async function getRelatedProductsUseCase(
  repo: ProductsRepository,
  category: string,
  currentId: ProductId,
): Promise<Product[]> {
  const normalizedCategory = category.trim();
  if (!normalizedCategory) return [];

  const validCurrentId = productIdSchema.parse(currentId);
  const related = await repo.getRelatedProducts(normalizedCategory, validCurrentId);
  return related.filter((product) => product.id !== validCurrentId);
}
