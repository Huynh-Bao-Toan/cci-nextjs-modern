# Server-side HTTP utility

`@/lib/api/http-server` cung cấp factory `createHttpServer` dùng native `fetch` cho **Server Components**, **Route Handlers**, và **Server Actions** trong Next.js App Router.

> **Khác biệt với `http-client`**:  
> `http-client` dùng Axios cho **client-side** (browser).  
> `http-server` dùng native `fetch` để tận dụng Next.js `cache` / `next` options.

---

## Tạo một instance per API

```ts
import { createHttpServer } from "@/lib/api/http-server";
import { getDummyJsonBaseUrl } from "@/lib/api/env";

const http = createHttpServer({
  baseURL: getDummyJsonBaseUrl(),
  defaultHeaders: {
    "x-api-key": process.env.API_KEY ?? "",
  },
});
```

---

## GET — đọc dữ liệu

```ts
// Static (ISR / force-cache)
const products = await http.get<ProductsResponse>("/products", {
  searchParams: { limit: 10, skip: 0 },
  cache: "force-cache",
});

// Dynamic (no-store)
const product = await http.get<Product>(`/products/${id}`, {
  cache: "no-store",
});

// Next.js tag-based revalidation
const data = await http.get<Data>("/data", {
  next: { revalidate: 3600, tags: ["products"] },
});

// Hoặc dùng helper cacheOptions (map sang cache + next)
const categories = await http.get<string[]>("/products/categories", {
  cacheOptions: {
    mode: "force-cache",
    revalidate: 3600,
    tags: ["products:categories"],
  },
});
```

---

## POST / PUT / PATCH — ghi dữ liệu

```ts
const created = await http.post<Product, CreateProductDto>("/products/add", {
  title: "New Product",
  price: 99,
});

const updated = await http.put<Product, UpdateProductDto>(`/products/${id}`, {
  title: "Updated",
});

const patched = await http.patch<Product, Partial<Product>>(`/products/${id}`, {
  price: 79,
});
```

---

## DELETE

```ts
const result = await http.delete<{ isDeleted: boolean }>(`/products/${id}`);
```

---

## Upload file (FormData)

```ts
const form = new FormData();
form.append("file", file);

// Content-Type sẽ tự động được bỏ để fetch tự thêm boundary
const result = await http.post<UploadResponse>("/upload", form);
```

---

## Download blob

```ts
const blob = await http.get<Blob>("/files/report.pdf", {
  responseType: "blob",
  headers: { Accept: "application/pdf" },
});
```

---

## Cancellation & Timeout

```ts
const controller = new AbortController();

const data = await http.get<Data>("/data", {
  signal: controller.signal,
});

// Hoặc dùng timeout tự động (ms)
const data2 = await http.get<Data>("/data", {
  timeout: 5_000,
});

// Huỷ request
controller.abort();
```

---

## Error handling

Mọi lỗi đều được ném ra dưới dạng `HttpServerError`:

```ts
import { HttpServerError, toHttpServerError } from "@/lib/api/http-server";

try {
  const data = await http.get<Data>("/products");
} catch (err) {
  const error = toHttpServerError(err);
  console.error(error.code);   // "NETWORK" | "TIMEOUT" | "CANCELLED" | "SERVER" | "UNKNOWN"
  console.error(error.status); // HTTP status code (0 nếu không có response)
  console.error(error.message);
}
```

---

## Escape-hatch — `request()` generic

```ts
const result = await http.request<MyResponse>({
  method: "HEAD",
  url: "/ping",
  headers: { "x-custom": "value" },
});
```

---

## Notes

- `http-server` **không parse body** cho `HEAD` và các status **204 / 205 / 304** (trả về `undefined`).
- Với `responseType: "json"`, `http-server` **chỉ parse JSON khi `content-type` là JSON**; nếu không sẽ throw `HttpServerError` với message rõ ràng.
- Dev log của `http-server` không còn phụ thuộc thời gian hệ thống trong request flow (an toàn hơn với prerender/cache components).
