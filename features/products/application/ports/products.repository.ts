import type { PaginatedProducts, ProductsSearchParams } from "../../domain/products.models";
import type { Product, ProductId } from "../../domain/product.types";

export type ProductsRepository = {
  searchProducts(params: ProductsSearchParams): Promise<PaginatedProducts>;
  getProductById(id: ProductId): Promise<Product | null>;
  getRelatedProducts(category: string, currentId: ProductId): Promise<Product[]>;
  getCategories(): Promise<string[]>;
};
