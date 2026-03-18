# Client-only HTTP client

`@/lib/api/http/index` provides a reusable Axios factory for FE-only modules.

## Create a client per API

```ts
import { createHttpClient } from "@/lib/api/http/index";
import { ApiService, apiBaseUrls } from "@/lib/constants/apis";

export const http = createHttpClient({
  baseURL: apiBaseUrls[ApiService.DummyJson],
  getAccessToken: async () => localStorage.getItem("access_token"),
  onUnauthorized: () => {
    // hook for refresh-token/logout flow
  },
});
```

## Common requests

```ts
await http.get("/products", { params: { limit: 10, skip: 0 } });
await http.post("/products/add", payload);
await http.put(`/products/${id}`, payload);
await http.patch(`/products/${id}`, payload);
await http.delete(`/products/${id}`);
```

## Upload / download / cancellation / timeout

```ts
const controller = new AbortController();

await http.post("/files/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" },
  signal: controller.signal,
});

await http.get<Blob>("/files/report", {
  responseType: "blob",
  timeout: 30_000,
  headers: { Accept: "application/pdf" },
});
```

## TanStack Query usage

```ts
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/features/products-portal/api/products.api";

export function useProductsQuery(params: ProductsSearchParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => searchProducts(params),
  });
}
```
