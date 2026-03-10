import { httpGetJson } from "@/lib/api/http";

import type { RawProductsResponse } from "../api/products.types";
import { mapRawProductsResponse } from "../api/products.mapper";

export async function getRelatedProducts(category: string, currentId: number) {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", "4");
  searchParams.set("skip", "0");

  const raw = await httpGetJson<RawProductsResponse>(
    `/products/category/${encodeURIComponent(category)}`,
    {
      searchParams,
      cache: "force-cache",
    },
  );

  const paginated = mapRawProductsResponse(raw, 4);

  return paginated.items.filter((product) => product.id !== currentId);
}

