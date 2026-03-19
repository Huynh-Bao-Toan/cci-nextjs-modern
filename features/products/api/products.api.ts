import "server-only";

import { createHttpServer } from "@/lib/api/http-server";
import type { ProductId } from "../domain/product.types";
import type { ProductsSearchParams } from "../domain/products.models";
import type {
  RawCategoriesResponse,
  RawProduct,
  RawProductsResponse,
} from "./products.types";
import { toProductsApiError } from "./products.client";
import { buildProductsSearchRequest, productsRoutes } from "./products.routes";
import { apiBaseUrls, ApiService } from "@/lib/constants/apis";

const http = createHttpServer({
  baseURL: apiBaseUrls[ApiService.DummyJson],
});

export async function searchProducts(
  params: ProductsSearchParams,
): Promise<RawProductsResponse> {
  try {
    const request = buildProductsSearchRequest(params);
    return await http.get<RawProductsResponse>(request.path, {
      searchParams: request.searchParams,
      cache: request.cache,
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function getProductById(id: ProductId): Promise<RawProduct> {
  try {
    return await http.get<RawProduct>(productsRoutes.byId(id), {
      cache: "force-cache",
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function getCategories(): Promise<RawCategoriesResponse> {
  try {
    return await http.get<RawCategoriesResponse>(productsRoutes.categories, {
      cache: "force-cache",
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}
