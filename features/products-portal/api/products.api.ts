import {
  createHttpClient,
  type AccessTokenProvider,
} from "@/lib/api/http-client/index";
import { ApiService, apiBaseUrls } from "@/lib/constants/apis";

import type { ProductId } from "../domain/product.types";
import type { ProductsSearchParams } from "../domain/products.models";
import type {
  CreateProductInput,
  RawCategoriesResponse,
  RawProduct,
  RawProductsResponse,
  UpdateProductInput,
} from "./products.types";
import { toProductsApiError } from "./products.client";
import { buildProductsSearchRequest, productsRoutes } from "./products.routes";

let productsAccessTokenProvider: AccessTokenProvider = () => undefined;

export function configureProductsApiAuth(provider: AccessTokenProvider) {
  productsAccessTokenProvider = provider;
}

const http = createHttpClient({
  baseURL: apiBaseUrls[ApiService.DummyJson],
  timeout: 15000,
  getAccessToken: () => productsAccessTokenProvider?.(),
  defaultHeaders: {
    "X-Client-App": "products-portal",
  },
});

export async function searchProducts(
  params: ProductsSearchParams,
): Promise<RawProductsResponse> {
  try {
    const request = buildProductsSearchRequest(params);
    return await http.get<RawProductsResponse>(request.path, {
      params: request.params,
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function getProductById(id: ProductId): Promise<RawProduct> {
  try {
    return await http.get<RawProduct>(productsRoutes.byId(id));
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function getCategories(): Promise<RawCategoriesResponse> {
  try {
    return await http.get<RawCategoriesResponse>(productsRoutes.categories);
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function createProduct(
  input: CreateProductInput,
): Promise<RawProduct> {
  try {
    return await http.post<RawProduct, CreateProductInput>(
      productsRoutes.create,
      input,
    );
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function updateProduct(
  id: ProductId,
  input: UpdateProductInput,
): Promise<RawProduct> {
  try {
    return await http.put<RawProduct, UpdateProductInput>(
      productsRoutes.update(id),
      input,
    );
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function deleteProduct(id: ProductId): Promise<{ id: ProductId }> {
  try {
    return await http.delete<{ id: ProductId }>(productsRoutes.remove(id));
  } catch (error) {
    throw toProductsApiError(error);
  }
}
