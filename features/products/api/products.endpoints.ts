import "server-only";

import { httpGetJson } from "@/lib/api/http";

import type { ProductId } from "../domain/product.types";
import type { ProductsSearchParams } from "../domain/products.models";
import type {
  RawCategoriesResponse,
  RawProduct,
  RawProductsResponse,
} from "./products.types";
import { toProductsApiError } from "./products.client";

function buildListSearchParams(params: ProductsSearchParams) {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(params.pageSize));
  searchParams.set("skip", String((params.page - 1) * params.pageSize));
  return searchParams;
}

export async function searchProducts(
  params: ProductsSearchParams,
): Promise<RawProductsResponse> {
  try {
    const searchParams = buildListSearchParams(params);

    if (params.q) {
      searchParams.set("q", params.q);
      return await httpGetJson<RawProductsResponse>("/products/search", {
        searchParams,
        cache: "no-store",
      });
    }

    if (params.category) {
      return await httpGetJson<RawProductsResponse>(
        `/products/category/${encodeURIComponent(params.category)}`,
        {
          searchParams,
          cache: "force-cache",
        },
      );
    }

    return await httpGetJson<RawProductsResponse>("/products", {
      searchParams,
      cache: "force-cache",
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function getProductById(id: ProductId): Promise<RawProduct> {
  try {
    return await httpGetJson<RawProduct>(`/products/${id}`, {
      cache: "force-cache",
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}

export async function getCategories(): Promise<RawCategoriesResponse> {
  try {
    return await httpGetJson<RawCategoriesResponse>("/products/categories", {
      cache: "force-cache",
    });
  } catch (error) {
    throw toProductsApiError(error);
  }
}
