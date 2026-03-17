# Tài liệu kiến trúc Clean Architecture toàn dự án

## 1. Mục tiêu

Tài liệu này mô tả cách toàn bộ dự án cci-nextjs-modern đang áp dụng Clean Architecture theo hướng feature-first.

Phạm vi:

- `features/products` (shop).
- `features/products-portal` (portal CRUD).
- Cách hai feature tích hợp vào `app/`, `components/`, `lib/`, `providers/`.

Mục tiêu chính:

- Thống nhất mô hình layer cho cả 2 feature.
- Nêu rõ chiều phụ thuộc và ranh giới giữa domain/application/adapter/infrastructure.
- Mô tả runtime flow chính cho shop và portal.
- Xác nhận mức độ đáp ứng Clean Architecture ở cấp toàn dự án.

## 2. Sơ đồ kiến trúc tổng thể

```text
Next.js App Router (app/*)
  - route/layout/loading/error boundaries
  - server/client orchestration
          |
          v
Presentation Layer
  - features/*/components
  - features/*/hooks
  - features/*/lib (URL state, query keys, params)
  - components/shared, components/ui
          |
          v
Composition Root
  - features/products/composition/products.container.ts
  - features/products-portal/composition/products.container.ts
          |
          v
Application Layer
  - features/*/application/use-cases/*
  - features/*/application/ports/products.repository.ts
          |
          v
Domain Layer
  - features/*/domain/*.types.ts
  - features/*/domain/*.models.ts
  - features/*/domain/*.schemas.ts
          ^
          |
Adapters (Implement Ports)
  - features/*/adapters/products-http.repository.ts
          |
          v
Infrastructure/API
  - features/*/api/* (client, endpoints, raw types, schemas, mappers)
  - shared infra: lib/api/http.ts, lib/api/axios.client.ts
```

Nguyên tắc lõi:

- `application` chỉ phụ thuộc `port` + `domain`, không phụ thuộc adapter concrete.
- Adapter là nơi duy nhất biết chi tiết HTTP endpoint/raw payload.
- Mapping raw -> domain chỉ diễn ra tại boundary API/Adapter.
- UI gọi use-case qua composition container, không gọi endpoint trực tiếp.

## 3. Ánh xạ layer theo từng feature

### 3.1 Feature `products` (shop)

- Domain: `features/products/domain/*`.
- Application: `features/products/application/*`.
- Adapter: `features/products/adapters/products-http.repository.ts`.
- Composition: `features/products/composition/products.container.ts`.
- Presentation: `features/products/components/*`, `features/products/hooks/*`, `features/products/lib/*`.

Use-cases chính:

- `search-products.use-case.ts`
- `get-product-detail.use-case.ts`
- `get-related-products.use-case.ts`
- `get-categories.use-case.ts`

Đặc trưng runtime:

- Server-first cho listing/detail qua route trong `app/(shop)/*`.
- Favorites là client state cục bộ trong `features/products/store/favorites.store.ts`.

### 3.2 Feature `products-portal` (portal)

- Domain: `features/products-portal/domain/*`.
- Application: `features/products-portal/application/*`.
- Adapter: `features/products-portal/adapters/products-http.repository.ts`.
- Composition: `features/products-portal/composition/products.container.ts`.
- Presentation: `features/products-portal/components/*`, `features/products-portal/hooks/*`, `features/products-portal/lib/*`.

Use-cases chính:

- `search-products.use-case.ts`
- `get-categories.use-case.ts`
- `get-product-detail.use-case.ts`
- `create-product.use-case.ts`
- `update-product.use-case.ts`
- `delete-product.use-case.ts`

Đặc trưng runtime:

- Client-driven tương tác cao với React Query (query/mutation/invalidation).
- URL state đồng bộ qua `nuqs` (`products.url-state.ts`).

## 4. Vai trò của các thư mục dùng chung trong kiến trúc

- `app/*`: điểm vào (entrypoint) theo route, quyết định server/client boundary và gọi facade từ composition.
- `components/ui/*`: design system primitives (không chứa business logic).
- `components/shared/*`: shell/layout/state UI dùng chung (không phụ thuộc endpoint).
- `lib/api/*`: hạ tầng HTTP dùng lại giữa feature (`fetch` wrapper, axios client).
- `providers/*`: cross-cutting providers (`QueryProvider`, `ThemeProvider`, `NuqsAdapter`, `Toaster`).
- `tests/*`: kiểm thử theo unit/component/e2e, tập trung vào domain mapping, params normalization, UI behavior.

## 5. Luồng runtime chính toàn dự án

### 5.1 Luồng đọc danh sách ở shop (`/products`)

1. Route server đọc `searchParams`.
2. Parse/normalize bằng `features/products/lib/product.params.ts`.
3. Gọi `searchProducts` từ `features/products/composition/products.container.ts`.
4. Use-case gọi `ProductsRepository` port.
5. `ProductsHttpRepository` gọi API endpoint tương ứng.
6. Mapper parse raw payload bằng Zod và map sang domain model.
7. UI server render `ProductGrid` và phân trang bằng domain data.

### 5.2 Luồng đọc danh sách ở portal (`/products-portal`)

1. URL state đọc/ghi qua `features/products-portal/lib/products.url-state.ts`.
2. Params chuyển thành `ProductsSearchParams` qua `products.params.ts`.
3. Hook query gọi `productsQueries.list(params)`.
4. `productsQueries` gọi `searchProducts` từ composition container.
5. Use-case -> repository -> endpoint -> mapper.
6. React Query cache domain model, UI render table/pagination.

### 5.3 Luồng mutation ở portal (create/update/delete)

1. Form/alert trigger mutation hook.
2. Mutation gọi facade `createProduct`/`updateProduct`/`deleteProduct` từ composition.
3. Use-case validate id/payload qua domain schema.
4. Repository gọi endpoint tương ứng.
5. Mapper trả về domain entity, sau đó invalidate list query để đồng bộ UI.

## 6. Đánh giá mức độ đạt Clean Architecture

Checklist tổng hợp:

- Domain độc lập framework: Đạt (cả 2 feature).
- Use-case chỉ phụ thuộc abstraction: Đạt.
- Port đặt ở Application, implementation đặt ở Adapter: Đạt.
- Composition root đứng ngoài Application để wiring dependency: Đạt.
- Mapping raw API -> domain ở boundary: Đạt.
- Presentation không phụ thuộc endpoint cụ thể: Đạt.

Kết luận:

- Cả `products` và `products-portal` đều đạt cấu trúc Clean Architecture thực dụng, nhất quán với mục tiêu mở rộng và testability của toàn dự án.

## 7. Điểm có thể cải thiện thêm ở cấp toàn dự án

- Có thể chuẩn hóa naming/query layer giữa hai feature để giảm duplication trong `lib/*.params.ts`, `lib/*.url-state.ts`.
- Composition hiện dùng singleton repository ở module scope; nếu cần đa môi trường runtime/test nâng cao có thể chuyển sang factory container.
- Nên thêm contract test cho từng `ProductsRepository` implementation để khóa chặt hành vi domain-level.
- Có thể bổ sung architecture decision record (ADR) trong `docs/` để theo dõi quyết định lớn khi mở rộng thêm feature mới.

## 8. Hướng dẫn mở rộng feature mới theo chuẩn hiện tại

Khi thêm feature mới (ví dụ `orders`), áp dụng theo thứ tự:

1. Tạo `domain/` (types, models, schemas) độc lập framework.
2. Định nghĩa port trong `application/ports`.
3. Viết use-cases trong `application/use-cases`.
4. Implement adapter trong `adapters/`.
5. Tạo endpoint/raw schema/mapper trong `api/`.
6. Wiring tại `composition/*.container.ts`.
7. Dùng từ `components/`, `hooks/`, `lib/` (URL state/query keys).
8. Thêm test unit cho use-case + mapper, test component/hook cho luồng chính.

Làm đúng thứ tự này sẽ giữ Dependency Rule ổn định và tránh rò rỉ infrastructure vào domain/application.
