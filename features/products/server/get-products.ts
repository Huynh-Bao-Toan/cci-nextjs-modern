import "server-only";

import { httpGetJson } from "@/lib/api/http";

import type { RawProductsResponse } from "../api/products.types";
import { mapRawProductsResponse } from "../api/products.mapper";
import type { ProductSearchParams } from "../lib/product-query-params";

export async function getProducts(params: ProductSearchParams) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
    return getSearchedProducts(params, searchParams);
  }

  if (params.category) {
    searchParams.set("limit", String(params.pageSize));
    searchParams.set("skip", String((params.page - 1) * params.pageSize));

    const raw = await httpGetJson<RawProductsResponse>(
      `/products/category/${encodeURIComponent(params.category)}`,
      {
        searchParams,
        cache: "force-cache",
      },
    );

    return mapRawProductsResponse(raw, params.pageSize);
  }

  searchParams.set("limit", String(params.pageSize));
  searchParams.set("skip", String((params.page - 1) * params.pageSize));

  const raw = await httpGetJson<RawProductsResponse>("/products", {
    searchParams,
    cache: "force-cache",
  });

  return mapRawProductsResponse(raw, params.pageSize);
}

async function getSearchedProducts(
  params: ProductSearchParams,
  searchParams: URLSearchParams,
) {
  searchParams.set("limit", String(params.pageSize));
  searchParams.set("skip", String((params.page - 1) * params.pageSize));

  const raw = await httpGetJson<RawProductsResponse>("/products/search", {
    searchParams,
    cache: "no-store",
  });

  return mapRawProductsResponse(raw, params.pageSize);
}

