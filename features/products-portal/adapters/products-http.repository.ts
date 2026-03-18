import { ProductsApiError } from "../api/products.client";
import {
  createProduct as createProductEndpoint,
  deleteProduct as deleteProductEndpoint,
  getCategories as getCategoriesEndpoint,
  getProductById as getProductByIdEndpoint,
  searchProducts as searchProductsEndpoint,
  updateProduct as updateProductEndpoint,
} from "../api/products.api";
import { mapRawProduct, mapRawProductsResponse } from "../api/products.mappers";
import { rawCategoriesResponseSchema } from "../api/products.schemas";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../domain/product.schemas";
import type { Product, ProductId } from "../domain/product.types";
import type {
  PaginatedProducts,
  ProductsSearchParams,
} from "../domain/products.models";
import type { ProductsRepository } from "../application/ports/products.repository";

export class ProductsHttpRepository implements ProductsRepository {
  async searchProducts(
    params: ProductsSearchParams,
  ): Promise<PaginatedProducts> {
    const raw = await searchProductsEndpoint(params);
    return mapRawProductsResponse(raw, {
      page: params.page,
      pageSize: params.pageSize,
    });
  }

  async getProductById(id: ProductId): Promise<Product | null> {
    try {
      const raw = await getProductByIdEndpoint(id);
      return mapRawProduct(raw);
    } catch (error) {
      if (error instanceof ProductsApiError && error.status === 404)
        return null;
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    const raw = await getCategoriesEndpoint();
    const parsed = rawCategoriesResponseSchema.parse(raw);
    return parsed.map((item) =>
      typeof item === "string" ? item : (item.slug ?? item.name ?? ""),
    );
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const raw = await createProductEndpoint(input);
    return mapRawProduct(raw);
  }

  async updateProduct(
    id: ProductId,
    input: UpdateProductInput,
  ): Promise<Product> {
    const raw = await updateProductEndpoint(id, input);
    return mapRawProduct(raw);
  }

  async deleteProduct(id: ProductId): Promise<{ id: ProductId }> {
    const result = await deleteProductEndpoint(id);
    return { id: result.id };
  }
}
