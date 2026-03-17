## 1. Triết lý kiến trúc & tổng quan thư mục

Ghi chú chuẩn hóa tài liệu:

- Tài liệu kiến trúc chính thống: `docs/architecture.md`.
- Tài liệu này tập trung vào cấu trúc thư mục, naming convention, và cách tổ chức mã nguồn.

Project được tổ chức theo **feature-first architecture**, kết hợp rõ ràng giữa:

- **App Router layer (`app/`)**: định nghĩa route, layout, boundary (loading/error), quyết định server vs client.
- **Feature layer (`features/*`)**: mỗi domain nghiệp vụ (ví dụ `products`, `products-portal`) tự quản lý **domain model, API layer, và toàn bộ Presentation layer (components/hooks/lib) gom trong `presentation/`**.
- **Shared UI & shell (`components/*`)**: design system (`components/ui`) và layout/thành phần chia sẻ (`components/shared`).
- **Infrastructure & cross-cutting (`lib/`, `providers/`, `styles/`)**: HTTP clients, util, global providers, theming, tailwind/shadcn.
- **Testing layer (`tests/`)**: kiểm thử unit + component + e2e gắn chặt với feature và component cụ thể.

Triết lý chính:

- **Server-first cho trải nghiệm shop**: route `app/(shop)/products` render server, dùng fetch wrapper (`lib/api/http.ts`) và URL params thuần.
- **Client-driven + React Query cho portal**: route `app/(portal)/products-portal` dùng React Query, URL state với `nuqs`, hydration từ server.
- **Tách lớp dữ liệu rõ ràng**:
  - **Raw API model** (`*.types.ts` trong `api/`)
  - **Validation schema** (`*.schemas.ts`)
  - **Mapper** (`*.mapper.ts` / `*.mappers.ts`)
  - **Domain model** (`domain/*.types.ts`, `domain/*.models.ts`)
  - UI chỉ làm việc với **domain model**, không chạm trực tiếp vào raw API response.
- **URL là nguồn sự thật cho state tìm kiếm/lọc/phân trang**:
  - Feature shop: `features/products/presentation/lib/product.params.ts`, `product-url-state.ts`.
  - Portal: `features/products-portal/presentation/lib/products.params.ts`, `products.url-state.ts`.

Nhờ cách tổ chức này, developer mới có thể nhìn route trong `app/`, lần theo sang `features/*`, và nhanh chóng nắm được data flow, nơi đặt logic, nơi đặt UI.

---

## 2. Thư mục root & vai trò kiến trúc

### `app/`

**Mục đích**

- Thư mục **App Router** của Next.js: định nghĩa route, layout, segment, error/loading boundary.
- Chịu trách nhiệm:
  - Quyết định **server component vs client component** cho từng route.
  - Ghép `features/*` và `components/shared` thành page hoàn chỉnh.
  - Thiết lập layout gốc, metadata, global providers.

**Code điển hình**

- `app/layout.tsx`: root layout, import `AppProviders` và global styles.
- `app/(marketing)/page.tsx`: homepage marketing, gọi `getCategories` từ `features/products/composition/products.container`.
- `app/(shop)/layout.tsx`: bọc các route shop trong `PageShell`.
- `app/(shop)/products/page.tsx`: server component cho listing products, dùng:
  - `searchProducts`, `getCategories` (composition layer trong `features/products/composition`),
  - `parseProductSearchParams`, `buildProductsHref` (URL/state helper trong `features/products/presentation/lib`),
  - `ProductGrid`, `FavoriteToggle`, `ProductListToolbar` (UI feature trong `features/products/presentation/components`).
- `app/(portal)/products-portal/page.tsx`: route portal dùng React Query + URL state + hydration:
  - `parseProductsSearchParams`, `getDefaultProductsSearchParams` (params),
  - `productsQueries` (React Query helper),
  - `ProductsPortalPage` (client component chính).

**Không nên đặt**

- Không đặt **business logic** trực tiếp trong các file route (ví dụ logic mapping, validation phức tạp).
- Không đặt **domain models** hoặc **API client** ở đây.

---

### `features/`

**Mục đích**

- Chứa toàn bộ **business logic** theo từng domain feature.
- Mỗi feature là một **bounded context** độc lập, gồm:
  - `domain/` – types/models/schemas gắn với domain.
  - `api/` – raw API types, schemas, endpoints, mappers.
  - `application/`, `adapters/`, `composition/` – clean architecture layers (use-cases, ports, repository wiring).
  - `presentation/` – **toàn bộ Presentation layer**, gom:
    - `presentation/components/` – UI gắn liền với nghiệp vụ feature.
    - `presentation/hooks/` – custom hooks của feature.
    - `presentation/lib/` – helper, URL/params, keys/queries, constants,...
  - `store/` – state management cục bộ của feature (VD favorites).

**Ví dụ feature hiện có**

- `features/products/`: trải nghiệm **shop** cho người dùng cuối.
- `features/products-portal/`: **portal quản trị** cho CRUD products.

**Không nên đặt**

- Không nhét **shared components** không thuộc riêng feature (đặt vào `components/shared`).
- Không đặt **HTTP client chung** (đặt vào `lib/api`).

---

### `components/`

**Mục đích**

- Tách phần UI dùng chung khỏi feature cụ thể:
  - `components/ui/`: primitive components (design system) dựa trên shadcn/radix.
  - `components/shared/`: layout, shell, header/footer, pagination, empty/error state, section heading,...

**Ví dụ**

- `components/ui/button.tsx`: shadcn-like Button với `cva` và `cn`.
- `components/ui/input.tsx`, `textarea.tsx`, `dialog.tsx`, `alert-dialog.tsx`, `pagination.tsx`, `sonner.tsx`...
- `components/shared/page-shell.tsx`: skeleton layout chung cho `(shop)`.
- `components/shared/empty-state.tsx`, `error-state.tsx`, `pagination.tsx`, `app-header.tsx`, `app-footer.tsx`, `section-heading.tsx`.

**Không nên đặt**

- Không đặt **business logic** (mapping API, validate domain, xử lý params) trong `components/`.
- Không đặt **domain types** hoặc **API clients** tại đây.

---

### `lib/`

**Mục đích**

- Chứa **cross-cutting utilities** dùng được ở nhiều feature:
  - `lib/api/`: HTTP/axios client, error model chung.
  - `lib/utils.ts`, `lib/utils/*`: hàm helper chung (ví dụ `cn`, number formatting).

**Ví dụ**

- `lib/api/axios.client.ts`: tạo `apiClient` cho DummyJSON + `ApiClientError` chuẩn hóa error.
- `lib/api/http.ts`: wrapper `httpGetJson` trên `fetch` dùng trong `features/products`.
- `lib/utils.ts`: `cn` gộp Tailwind class dùng khắp project.
- `lib/utils/number.ts`: format số.

**Không nên đặt**

- Không đặt code **đặc thù một feature** (VD parse search params sản phẩm) – hãy để trong `features/products/presentation/lib` hoặc `features/products-portal/presentation/lib`.

---

### `providers/`

**Mục đích**

- Gom **global React providers** thành một layer riêng, giúp `app/layout.tsx` chỉ cần gọi `AppProviders`.

**Ví dụ**

- `providers/app-providers.tsx`:
  - Wrap `ThemeProvider` → `NuqsAdapter` → `QueryProvider` → `Toaster`.
- `providers/query-provider.tsx`:
  - Tạo `QueryClient` với options mặc định, bật `ReactQueryDevtools` ở dev.
- `providers/theme-provider.tsx`:
  - Cấu hình `next-themes` cho dark/light mode.

**Không nên đặt**

- Không đặt logic domain hay API ở đây – chỉ nên là wiring provider.

---

### `hooks/` (root)

**Mục đích**

- Dự phòng cho **cross-feature hooks** trong tương lai.
- Hiện tại chỉ có `.gitkeep`, chưa có hook dùng chung.

**Khuyến nghị**

- Khi một hook bắt đầu được share giữa nhiều feature, nên cân nhắc:
  - Nếu hook về UI (VD scroll, resize) → đặt ở `hooks/`.
  - Nếu hook gắn domain cụ thể → để trong `features/<feature>/presentation/hooks/`.

---

### `stores/` (root)

**Mục đích**

- Dự phòng cho state stores cross-feature.
- Hiện tại chỉ có `.gitkeep`.

**Pattern hiện tại**

- State gắn với feature (VD favorites) đang để ở `features/products/store/favorites.store.ts` – đây là hướng **feature-local state**, khá tốt cho modularity.

---

### `styles/`

**Mục đích**

- Chứa cấu hình style toàn cục:
  - `styles/globals.css`: import tailwind, shadcn theme, custom CSS utilities.
  - `styles/fonts.ts`: khai báo font (geist, geistSans, geistMono) dùng trong `app/layout.tsx`.

**Không nên đặt**

- Không đặt scoped styles cho component riêng lẻ (ưu tiên Tailwind ngay trong JSX).

---

### `docs/`

**Mục đích**

- Tài liệu kỹ thuật và kiến trúc:
  - `project-documentation.md`: overview về chức năng, stack và flow lớn.
  - `project-structure.md`: (tài liệu hiện tại) – tập trung vào **kiến trúc folder & convention**.

---

### `tests/`

**Mục đích**

- Tổ chức test theo **loại** và **tính năng**:
  - `tests/unit/*.test.ts`: test logic thuần (formatters, params, mappers, keys).
  - `tests/components/*.test.tsx`: test UI component.
  - `tests/*.spec.ts`: e2e/smoke scenario (VD `products-portal.spec.ts`).

**Ví dụ**

- `tests/unit/products-portal.params.test.ts`: test `parseProductsSearchParams` và `normalizeProductsSearchParams`.
- `tests/unit/products-mapper.test.ts`: test map raw API → domain.
- `tests/components/product-card.test.tsx`: test component hiển thị product.

---

## 3. Kiến trúc bên trong một feature

Lấy ví dụ **feature shop**: `features/products/`

```text
features/products/
  api/
    products.types.ts
    products.schemas.ts
    products.mappers.ts
    products.mapper.ts
    products.endpoints.ts
    products.client.ts
  domain/
    product.types.ts
    products.models.ts
    product.schemas.ts
  application/
    ports/
      products.repository.ts
    use-cases/
      search-products.use-case.ts
      get-product-detail.use-case.ts
      get-related-products.use-case.ts
      get-categories.use-case.ts
  adapters/
    products-http.repository.ts
  composition/
    products.container.ts
  presentation/
    lib/
      product.params.ts
      product-url-state.ts
      product-urls.ts
      product-formatters.ts
    hooks/
      use-favorites.ts
    components/
      product-grid.tsx
      product-card.tsx
      product-gallery.tsx
      product-price.tsx
      product-skeleton.tsx
      product-list-toolbar.tsx
      favorite-toggle.tsx
  store/
    favorites.store.ts
```

### `domain/` – domain model

- Định nghĩa **domain types** – ví dụ `features/products/domain/product.types.ts`:
  - `Product`, `PaginatedProducts` với field tên chuẩn, tránh phụ thuộc naming từ API.
- Mục tiêu:
  - Tách biệt giữa **cách backend trả dữ liệu** và **cách frontend muốn dùng dữ liệu**.
  - Cho phép thay đổi backend mà không phá UI.

### `api/` – API layer & mapping

- `*.types.ts`: mô tả **raw API** đúng như response từ DummyJSON.
- `*.schemas.ts`: dùng `zod` để validate và chuẩn hóa raw response.
- `*.mapper.ts` / `*.mappers.ts`: chuyển từ **raw** sang **domain**:
  - Ví dụ `features/products/api/products.mappers.ts`:
    - `mapRawProduct`:
      - Parse bằng `productSchema.parse`.
      - Map field `thumbnail` → `thumbnailUrl`, `images` → `imageUrls`, handle field optional.
    - `mapRawProductsResponse`:
      - Parse toàn bộ response bằng `productsResponseSchema`.
      - Tính `page` từ `skip` và `limit`.
      - Trả về `PaginatedProducts` domain.
- Với portal (`features/products-portal/api`):
  - `products.types.ts`: raw type + input DTO (Create/Update).
  - `products.schemas.ts`: schema validate raw list/categories.
  - `products.endpoints.ts`: functions như `searchProducts`, `getCategories`, `createProduct`, `updateProduct`, `deleteProduct`.

### `application/` + `adapters/` + `composition/` – clean architecture core (shop)

- `application/`:
  - `ports/products.repository.ts`: định nghĩa contract data access.
  - `use-cases/*`: business rules, normalize/validate, không phụ thuộc Next.js/HTTP concrete.
- `adapters/products-http.repository.ts`:
  - Implement `ProductsRepository`, gọi API endpoints và map raw -> domain.
- `composition/products.container.ts`:
  - Wiring concrete repository vào use-cases, export facade cho app routes dùng trực tiếp.

### `presentation/lib/` – helper & URL state (feature-level)

- **Shop (`features/products/presentation/lib`)**
  - `product.params.ts`:
    - Dùng `zod` để parse/validate `searchParams` từ URL.
  - `product-url-state.ts`:
    - Dùng `nuqs` để định nghĩa shape state URL (`q`, `category`, `page`) và options (history replace/push).
  - `product-urls.ts`:
    - Build URL thân thiện từ `ProductSearchParams`.
  - `product-formatters.ts`:
    - Định nghĩa cách format giá, label,... cho product.

- **Portal (`features/products-portal/presentation/lib`)**
  - `products.params.ts`:
    - `parseProductsSearchParams`, `normalizeProductsSearchParams`, `getDefaultProductsSearchParams`.
    - Dùng `zod` và `es-toolkit` để flatten, chuẩn hóa, loại bỏ giá trị rỗng (`omitBy` + `isNil`).
  - `products.url-state.ts`:
    - Client-only file với `nuqs`, map URL ↔ `ProductsSearchParams`.
    - Tách options cho filter vs page (`PRODUCTS_URL_STATE_OPTS_*`).
  - `products.queries.ts`:
    - Định nghĩa `productsQueries` cho React Query, map **raw** → **domain** trong queryFn.
  - `products.keys.ts`:
    - Chuẩn hóa query key cho React Query.
  - `products.constants.ts`:
    - Default params, hằng số liên quan tìm kiếm.
  - `products.toast.ts`:
    - Helper hiển thị toast cho các action portal.

### `presentation/hooks/` – custom hooks gắn với feature

- Ví dụ `features/products/presentation/hooks/use-favorites.ts`:
  - Bọc quanh `useFavoritesStore` (Zustand).
  - Đưa ra API thân thiện cho UI:
    - `items`, `isFavorite`, `toggleFavorite(product)`, `removeFavorite`, `clear`.
  - Tích hợp toast (`sonner`) khi add/remove.

### `store/` – state management feature-local

- `features/products/store/favorites.store.ts`:
  - Dùng `zustand` + `persist` + `devtools`:
    - `FavoriteProduct` (subset domain `Product`).
    - `items: Record<number, FavoriteProduct>`.
    - `toggleFavorite`, `removeFavorite`, `clear`.
  - Lợi ích:
    - Tách state local (favorites) khỏi React Query, không phụ thuộc backend.
    - Persist vào `localStorage` với key ổn định.

### `presentation/components/` – UI gắn domain

- Các component ở đây **nhận domain types** làm props:
  - `ProductGrid`, `ProductCard`, `ProductGallery`, `ProductPrice`, `ProductListToolbar`, `FavoriteToggle`, `ProductSkeleton`.
- Lớp này **không**:
  - Gọi trực tiếp API.
  - Parse URL hay search params.
  - Biết format raw response từ backend.

---

## 4. Pattern đặt tên file & phân lớp

Các hậu tố file thể hiện rõ **vai trò kiến trúc**:

### 4.1. Hậu tố domain & API

- **`.types.ts`**
  - Domain types: `features/products/domain/product.types.ts`, `features/products-portal/domain/product.types.ts`.
  - Raw API types: `features/products/api/products.types.ts`, `features/products-portal/api/products.types.ts`.

- **`.models.ts`**
  - Domain models phức tạp hơn type thuần: `features/products-portal/domain/products.models.ts`.

- **`.schemas.ts`**
  - Zod schemas cho:
    - Raw API: `features/products/api/products.schemas.ts`, `features/products-portal/api/products.schemas.ts`.
    - Domain validate: `features/products-portal/domain/product.schemas.ts`.

- **`.mapper.ts` / `.mappers.ts`**
  - Map **Raw API → Domain model**:
    - `features/products/api/products.mappers.ts` (file chính).
    - `features/products/api/products.mapper.ts` (compat re-export).
    - `features/products-portal/api/products.mappers.ts`.

- **`.endpoints.ts`**
  - Tập trung các hàm gọi API backend:
    - `features/products/api/products.endpoints.ts`.
    - `features/products-portal/api/products.endpoints.ts`.
  - Thường trả về **raw type**, để mapper hoặc React Query xử lý tiếp.

### 4.2. URL state & params

- **`.params.ts`**
  - Parse/normalize **query params** từ URL thành cấu trúc typed:
    - `features/products-portal/presentation/lib/products.params.ts`.
    - `features/products/presentation/lib/product.params.ts`.

- **`.url-state.ts`**
  - Định nghĩa **shape state đồng bộ với URL** bằng `nuqs`:
    - `features/products/presentation/lib/product-url-state.ts`.
    - `features/products-portal/presentation/lib/products.url-state.ts`.

### 4.3. Query & key

- **`.queries.ts`**
  - Định nghĩa React Query queries, queryFn, staleTime:
    - `features/products-portal/presentation/lib/products.queries.ts`.

- **`.keys.ts`**
  - Chứa factory tạo query keys:
    - `features/products-portal/presentation/lib/products.keys.ts`.

### 4.4. UI & hooks

- **`.client.tsx`**
  - Component rõ ràng là **client component** cho feature:
    - `features/products-portal/presentation/components/products-page.client.tsx`.

- **`use-*.ts`**
  - Custom hooks:
    - `features/products/presentation/hooks/use-favorites.ts`.
    - `features/products-portal/presentation/hooks/use-products-query.ts`, `use-categories-query.ts`, `use-create-product-mutation.ts`, `use-update-product-mutation.ts`.

- **`*.store.ts`**
  - State store với Zustand:
    - `features/products/store/favorites.store.ts`.

### 4.5. Tóm tắt convention

| Hậu tố / Pattern             | Mục đích chính                         |
| ---------------------------- | -------------------------------------- |
| `.types.ts`                  | Định nghĩa type (domain hoặc raw API)  |
| `.models.ts`                 | Domain models, schema-đã-validate      |
| `.schemas.ts`                | Zod schemas cho raw/params/domain      |
| `.mapper.ts` / `.mappers.ts` | Map Raw API ↔ Domain                   |
| `.endpoints.ts`              | Hàm gọi API backend                    |
| `.params.ts`                 | Parse/normalize URL query params       |
| `.url-state.ts`              | Cấu hình state ↔ URL với `nuqs`        |
| `.queries.ts`                | Định nghĩa React Query `queryOptions`  |
| `.keys.ts`                   | Query key factories                    |
| `.store.ts`                  | Zustand store                          |
| `use-*.ts`                   | Custom hooks                           |
| `*.client.tsx`               | Client component rõ ràng trong feature |

Lợi ích:

- **Tìm kiếm nhanh** theo hậu tố để biết file thuộc layer nào.
- Giảm coupling: UI chỉ import từ `domain/`, `lib/` và `hooks/`, tránh lệ thuộc `api/`.
- Dễ thay đổi backend (chỉ cần sửa file `api/*` và `*.mapper.ts`).

---

## 5. Cấu trúc UI component & shadcn

### 5.1. Phân lớp component

| Loại component         | Vị trí                                 | Mục đích                                                |
| ---------------------- | -------------------------------------- | ------------------------------------------------------- |
| **UI primitives**      | `components/ui/*`                      | Design system + building blocks (button, input, dialog) |
| **Shared layout**      | `components/shared/*`                  | Page shell, header/footer, pagination, empty/error      |
| **Feature components** | `features/*/presentation/components/*` | UI gắn domain: product grid, toolbar, portal table      |

**UI primitives (`components/ui`)**

- Dựa trên **shadcn/ui + Radix**:
  - Ví dụ `components/ui/button.tsx` dùng:
    - `class-variance-authority` (`cva`) cho variant/size.
    - `cn` từ `lib/utils.ts` để merge class Tailwind.
  - Các component khác:
    - `input`, `textarea`, `select`, `dialog`, `alert-dialog`, `badge`, `card`, `table`, `pagination`, `skeleton`, `breadcrumbs`, `sonner` toast,...

**Shared layout (`components/shared`)**

- `page-shell.tsx`: layout chính (header + footer + nội dung).
- `app-header.tsx`, `app-footer.tsx`: khung site.
- `section-heading.tsx`, `empty-state.tsx`, `error-state.tsx`, `loading-skeleton.tsx`, `pagination.tsx`, `breadcrumb.tsx`, `mode-toggle.tsx`.

**Feature components (`features/*/presentation/components`)**

- **Shop (`features/products/presentation/components`)**:
  - `product-grid.tsx`, `product-card.tsx`, `product-gallery.tsx`, `product-price.tsx`, `product-list-toolbar.tsx`, `favorite-toggle.tsx`, `product-skeleton.tsx`.
- **Portal (`features/products-portal/presentation/components`)**:
  - `products-page.client.tsx` (container chính).
  - `products-toolbar.tsx`, `products-table.tsx`, `products-pagination.tsx`, `products-search-box.tsx`, `products-empty.tsx`, `products-error.tsx`.
  - `product-form-dialog.tsx`, `delete-product-alert.tsx`.

Nguyên tắc:

- `components/ui` không biết gì về domain.
- `components/shared` chỉ nhận props generic.
- `features/*/presentation/components` nhận **domain types** (VD `Product`) và gọi hooks/URL state/portal logic.

---

## 6. Data flow điển hình

### 6.1. Flow shop (server-first)

Ví dụ route: `app/(shop)/products/page.tsx`

1. **URL search params** đi vào `ProductsPage`:
   - Prop `searchParams` (Next App Router).
   - Gọi `parseProductSearchParams` trong `features/products/lib/product.params.ts`.
2. **Server data fetching**:
   - `searchProducts(parsedParams)` trong `features/products/composition/products.container.ts`:
     - Composition gọi `search-products.use-case.ts`.
     - Use-case gọi `ProductsHttpRepository` (adapter).
     - Adapter dùng `products.endpoints.ts` + `products.mappers.ts` để gọi DummyJSON và map raw -> domain.
3. **Domain → UI**:
   - `ProductGrid` nhận `products: Product[]`.
   - `FavoriteToggle` dùng `useFavorites` để thao tác `favorites.store.ts`.
   - `Pagination` build URL mới qua `buildProductsHref` (`product-urls.ts`).

Tóm tắt:

```text
URL search params
  ↓ parseProductSearchParams (zod)
Composition facade
  ↓ use-case + repository adapter
API fetch (products.endpoints.ts → DummyJSON)
  ↓ products.schemas + products.mappers
Domain Product / PaginatedProducts
  ↓
Feature components (ProductGrid, FavoriteToggle, Pagination)
```

### 6.2. Flow portal (client-driven + React Query)

Ví dụ route: `app/(portal)/products-portal/page.tsx`

1. **URL → search params**:
   - `searchParams` (promise) được resolve và đưa vào `parseProductsSearchParams`.
   - Nếu invalid → fallback `getDefaultProductsSearchParams`.
2. **Server prefetch**:
   - Tạo `QueryClient`.
   - `queryClient.prefetchQuery(productsQueries.categories())`.
   - `queryClient.prefetchQuery(productsQueries.list(params))`.
   - State được dehydrate và truyền vào `HydrationBoundary`.
3. **Client hydration + interaction**:
   - `ProductsPortalPage` (client component):
     - Dùng React Query hooks tương ứng để đọc cache.
     - Dùng `products.url-state.ts` để sync filter/sort/page với URL.
     - Dùng mutation hooks (`use-create-product-mutation`, `use-update-product-mutation`, `use-delete-product-mutation`) để thao tác CRUD.
4. **API layer**:
   - `products.endpoints.ts` gọi `productsApiClient` (axios client riêng).
   - Kết quả raw được parse bằng `raw*Schema` và map sang domain qua `products.mappers.ts`.

Tóm tắt:

```text
URL search params
  ↓ parseProductsSearchParams (zod + es-toolkit)
Server prefetch (React Query)
  ↓ dehydrate → HydrationBoundary
Client (ProductsPortalPage)
  ↓ React Query (productsQueries)
API layer (products.endpoints.ts + products.mappers.ts)
  ↓
Domain Product / PaginatedProducts
  ↓
Portal UI (table, toolbar, dialogs)
```

---

## 7. URL State pattern

Project sử dụng **URL như single source of truth** cho search/filter/pagination:

### 7.1. Shop: `features/products/lib/*`

- `product.params.ts`:
  - Parse `searchParams` thô từ Next (string | string[] | undefined).
  - Flatten thành object `{ [key: string]: string }`.
  - Validate bằng `zod` với default `page`, `pageSize`.
- `product-url-state.ts`:
  - Dùng `nuqs` để định nghĩa `productsUrlState` gồm `q`, `category`, `page`.
  - Đặt options:
    - FILTER (`PRODUCTS_URL_STATE_OPTS_FILTER`): dùng `history: "replace"` để không spam history.
    - PAGE (`PRODUCTS_URL_STATE_OPTS_PAGE`): dùng `history: "push"` để back/forward navigation hợp lý.

### 7.2. Portal: `features/products-portal/lib/*`

- `products.params.ts`:
  - `flattenSearchParams` → gom URLSearchParams vào object đơn giản.
  - `parseProductsSearchParams` → `safeParse` với `productsSearchParamsSchema`.
  - `normalizeProductsSearchParams` → trim, loại bỏ rỗng, `omitBy/isNil`.
- `products.url-state.ts`:
  - Client-only, định nghĩa `productsUrlState` với nhiều field hơn:
    - `q`, `category`, `sortBy`, `sortOrder`, `page`, `limit`.
  - Tách ba bộ option:
    - FILTER, PAGE, RESET – để phân biệt các trường hợp UX (thay đổi filter, đổi trang, reset tất cả).
  - Hàm `toProductsSearchParams`:
    - Map `ProductsUrlState` → `ProductsSearchParams`.
    - Validate bằng `zod`; nếu fail, fallback default.

Lợi ích:

- State có thể chia sẻ qua URL (copy/paste link).
- Back/forward browser hoạt động tự nhiên.
- Dễ test: chỉ cần giả lập query string.

---

## 8. Hook pattern

Các hook được đặt **theo feature** để giữ tính module:

- `features/products/hooks/use-favorites.ts`:
  - Bọc store `favorites.store.ts`, cung cấp API tự nhiên cho UI.
  - Thêm behavior như toast mà không lẫn vào component.

- `features/products-portal/hooks/use-products-query.ts`:
  - Bọc React Query + URL state để trả về kết quả search cho portal.

- `features/products-portal/hooks/use-categories-query.ts`:
  - Fetch & cache categories riêng.

- `features/products-portal/hooks/use-create-product-mutation.ts`,
  `use-update-product-mutation.ts`, `use-delete-product-mutation.ts`:
  - Đóng gói mutation logic, invalidation keys, toast, loading/error handling.

Nguyên tắc:

- Hook **không tự ý render UI**, chỉ trả về data + hành động.
- UI component import hook từ `features/*/hooks/*`, không trực tiếp gọi `products.endpoints.ts`.
- Điều này giúp:
  - Dễ test (mock hook).
  - Dễ refactor (đổi React Query sang thứ khác trong tương lai).

---

## 9. Tổng hợp naming convention & best practices

### 9.1. Naming convention

| Pattern                      | Ý nghĩa                                    |
| ---------------------------- | ------------------------------------------ |
| `.types.ts`                  | Type definitions (domain hoặc raw API)     |
| `.models.ts`                 | Domain models đã validate                  |
| `.schemas.ts`                | Zod schemas cho validate raw/params/domain |
| `.mapper.ts` / `.mappers.ts` | Mapping Raw API ↔ Domain model             |
| `.endpoints.ts`              | API request layer (gọi backend)            |
| `.params.ts`                 | Logic parse & normalize query params       |
| `.url-state.ts`              | URL state management với `nuqs`            |
| `.queries.ts`                | React Query `queryOptions`                 |
| `.keys.ts`                   | Query keys                                 |
| `.store.ts`                  | Zustand stores                             |
| `use-*.ts`                   | Custom hooks                               |
| `*.client.tsx`               | Client-only component trong feature        |

### 9.2. Best practices kiến trúc trong project

- **Không import trực tiếp raw API types vào UI**:
  - UI dùng domain types từ `domain/*.types.ts` hoặc schema inferred (`ProductSchema`).
  - Mọi mapping raw → domain phải đi qua `*.mapper.ts`.

- **Luôn map raw API → domain model trước khi dùng**:
  - Giảm coupling với backend.
  - Cho phép thêm field derived (VD `thumbnailUrl`) mà không đổi schema backend.

- **Feature code không phụ thuộc chéo feature khác**:
  - `features/products/*` và `features/products-portal/*` dùng chung `lib/`, `components/ui`, `components/shared`, nhưng không import trực tiếp module của nhau.

- **Shared utilities đặt trong `lib/` và `components/`**:
  - `lib/api/*`, `lib/utils*` cho helper chung.
  - `components/ui`, `components/shared` cho UI shareable.

- **UI component không chứa business logic**:
  - Mapping, validate, normalize params, tạo query keys… được làm ở `lib/`, `api/`, `domain/`, `hooks/`.

- **State management rõ ràng**:
  - Server state → React Query (portal) hoặc composition + use-cases + adapter (shop).
  - Client local state (favorites) → Zustand store trong `features/products/store`.
  - URL state → `nuqs` + `*.url-state.ts`.

Nhìn chung, kiến trúc hiện tại đã khá **sạch, rõ lớp, dễ mở rộng**. Developer mới chỉ cần:

1. Xác định route trong `app/`.
2. Nhảy vào feature tương ứng trong `features/*`.
3. Lần theo `domain/` → `api/` → `lib/` → `hooks/` → `components/`.

Là có thể hiểu nhanh full data flow và điểm mở rộng cho chức năng mới.
