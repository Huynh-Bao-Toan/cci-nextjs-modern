import type { ProductsRepository } from "../ports/products.repository";

export async function getCategoriesUseCase(
  repo: ProductsRepository,
): Promise<string[]> {
  const categories = await repo.getCategories();
  const normalized = categories
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.toLowerCase());

  return Array.from(new Set(normalized)).sort((a, b) => a.localeCompare(b));
}
