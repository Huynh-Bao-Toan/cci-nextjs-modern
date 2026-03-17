import {
  getCategories as getCategoriesEndpoint,
  getProductById as getProductByIdEndpoint,
  searchProducts as searchProductsEndpoint,
} from "../api/products.endpoints";
import {
  mapRawProduct,
  mapRawProductsResponse,
} from "../api/products.mappers";
import { rawCategoriesResponseSchema } from "../api/products.schemas";
import { ProductsApiError } from "../api/products.client";
import type { ProductsRepository } from "../application/ports/products.repository";
import type { Product, ProductId } from "../domain/product.types";
import type { PaginatedProducts, ProductsSearchParams } from "../domain/products.models";

export class ProductsHttpRepository implements ProductsRepository {
  async searchProducts(params: ProductsSearchParams): Promise<PaginatedProducts> {
    const raw = await searchProductsEndpoint(params);
    return mapRawProductsResponse(raw, params.pageSize);
  }

  async getProductById(id: ProductId): Promise<Product | null> {
    try {
      const raw = await getProductByIdEndpoint(id);
      return mapRawProduct(raw);
    } catch (error) {
      if (error instanceof ProductsApiError && error.status === 404) return null;
      throw error;
    }
  }

  async getRelatedProducts(category: string, currentId: ProductId): Promise<Product[]> {
    const raw = await searchProductsEndpoint({
      category,
      page: 1,
      pageSize: 4,
    });
    const paginated = mapRawProductsResponse(raw, 4);
    return paginated.items.filter((product) => product.id !== currentId);
  }

  async getCategories(): Promise<string[]> {
    const raw = await getCategoriesEndpoint();
    const parsed = rawCategoriesResponseSchema.parse(raw);

    return parsed.map((item) =>
      typeof item === "string" ? item : item.slug ?? item.name ?? "",
    );
  }
}
