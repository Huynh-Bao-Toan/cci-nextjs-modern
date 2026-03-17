# Tài liệu kỹ thuật dự án cci-nextjs-modern

## Nguồn tài liệu chính thống

- Kiến trúc Clean Architecture chính thức: `docs/architecture.md`.
- Tài liệu này giữ vai trò overview sản phẩm, stack kỹ thuật, và flow triển khai.

## 1. Tổng quan dự án (Overview)

Dự án là một mini commerce catalog xây trên Next.js App Router, gồm 2 mặt chức năng chính:

- Mặt người dùng mua sắm (shop): duyệt danh sách sản phẩm, lọc theo danh mục, xem chi tiết, lưu yêu thích.
- Mặt quản trị kiểu portal (products portal): tìm kiếm, lọc, sắp xếp, và CRUD sản phẩm trên giao diện bảng.

Mục tiêu thực tế thể hiện trong code:

- Trình diễn pattern render server-first cho catalog ở app/(shop)/products/page.tsx và app/(shop)/products/[id]/page.tsx.
- Trình diễn pattern client-driven với URL state + server state hydration ở app/(portal)/products-portal/page.tsx và features/products-portal/components/products-page.client.tsx.
- Trình diễn tách lớp API model -> mapper -> domain model ở cả 2 feature products và products-portal.

Đối tượng sử dụng:

- Frontend developer cần nền tảng Next.js 16 + React 19 có kiến trúc rõ layer.
- Team cần code mẫu cho URL-driven search/filter/pagination và module hóa theo feature.

Phạm vi hiện tại của project:

- Product catalog demo dùng DummyJSON làm backend API.
- Có giao diện portal quản lý sản phẩm nhưng chưa có auth/permission.
- Có test unit/component/e2e ở mức smoke và logic cốt lõi.

Phân loại dự án:

- E-commerce demo + Product catalog + Portal quản lý sản phẩm (hybrid).

## 2. Tech Stack của dự án

Nguồn: package.json và các file config liên quan.

### Framework và ngôn ngữ

- next 16.1.6: nền tảng chính, App Router, layout/route segment, error/loading boundary.
- react 19.2.3, react-dom 19.2.3: UI runtime.
- typescript 5: typing chặt với strict mode (tsconfig.json).

### UI và styling

- tailwindcss v4 + @tailwindcss/postcss: utility CSS, cấu hình qua postcss.config.mjs và styles/globals.css.
- shadcn + radix-ui + class-variance-authority: xây bộ components/ui kiểu design system nội bộ.
- clsx + tailwind-merge: gộp class an toàn trong lib/utils.ts (hàm cn).
- lucide-react: icon cho action UI.
- next-themes: dark/light theme trong providers/theme-provider.tsx.
- sonner: toast notification, mount ở providers/app-providers.tsx.

### Data fetching và state

- @tanstack/react-query: server state cho products-portal (query/mutation/cache/invalidation).
- axios: HTTP client cho products-portal API layer.
- fetch wrapper nội bộ ở lib/api/http.ts: HTTP layer cho feature products (shop).
- nuqs: đồng bộ state với URL search params cho cả products toolbar và products-portal page.
- zustand: global client state cho favorites trong features/products/store/favorites.store.ts.

### Validation và form

- zod: validate search params, raw API payload, form input schema.
- react-hook-form + @hookform/resolvers: quản lý form tạo/sửa sản phẩm.

### Tiện ích

- es-toolkit: debounce, omitBy, isNil trong URL params và search interactions.
- date-fns: xử lý ngày giờ (đã có dependency, mức sử dụng trong code hiện tại thấp).

### Testing và chất lượng

- vitest + testing-library + jsdom: unit/component tests.
- playwright: e2e smoke tests.
- eslint + eslint-config-next: linting theo Next core-web-vitals + TypeScript.

Ghi chú config quan trọng:

- next.config.ts cho phép ảnh remote từ cdn.dummyjson.com và dummyjson.com.
- Không có tailwind.config.\* ở root, phù hợp Tailwind v4 CSS-first.

## 3. Cấu trúc dự án (Project Structure)

Cây thư mục rút gọn theo hiện trạng:

    app/
      (marketing)/
      (shop)/
      (portal)/
      layout.tsx
      not-found.tsx
    features/
      products/
        api/ domain/ application/ adapters/ composition/ lib/ hooks/ store/ components/
      products-portal/
        api/ domain/ lib/ hooks/ components/
    components/
      ui/
      shared/
    lib/
      api/
      forms/
      utils/
      utils.ts
    providers/
    hooks/          (root, hiện chỉ có .gitkeep)
    stores/         (root, hiện chỉ có .gitkeep)
    tests/
      unit/
      components/
      *.spec.ts

Vai trò chính:

- app: routing và composition của route/layout theo App Router.
- features: tổ chức theo feature module, mỗi feature có API/domain/lib/hooks/components riêng.
- components/ui: primitive component tái sử dụng toàn app.
- components/shared: shell/header/footer/pagination/empty/error dùng chung.
- lib: helper cross-feature (API wrapper, utility).
- providers: nơi gom global provider chain.
- tests: tách unit/component/e2e.

Shared vs feature-based:

- Shared: `components/shared`, `components/ui`, `lib/api`, `providers`.
- Feature-based: `features/products/*` và `features/products-portal/*`.

Lưu ý nhất quán cấu trúc:

- Root có thư mục stores và hooks nhưng state/hook thực tế đang đặt trong feature tương ứng.
- Không có root domain, root api, root types, root utils theo nghĩa thư mục độc lập; các phần này phân tán theo feature và lib.

## 4. Kiến trúc tổng thể (Architecture)

Dự án dùng mô hình feature-module + layered architecture. Chi tiết chính thống về layer, dependency rule, runtime flow và checklist Clean Architecture được quản lý tại `docs/architecture.md` để tránh trùng lặp và lệch phiên bản giữa các tài liệu.

Tóm tắt nhanh:

- Shop (`features/products`): server-first, composition + use-cases + repository adapter.
- Portal (`features/products-portal`): client-driven với React Query + URL state (`nuqs`).
- Cả hai cùng áp dụng mapping raw API -> domain tại boundary adapter/API.

## 5. Routing và Rendering

### Routing với App Router

Route thực tế theo app tree:

- / -> app/(marketing)/page.tsx
- /products -> app/(shop)/products/page.tsx
- /products/[id] -> app/(shop)/products/[id]/page.tsx
- /categories/[slug] -> app/(shop)/categories/[slug]/page.tsx
- /favorites -> app/(shop)/favorites/page.tsx
- /products-portal -> app/(portal)/products-portal/page.tsx

Layout tổ chức:

- app/layout.tsx: root metadata, global CSS, AppProviders.
- app/(shop)/layout.tsx và app/(portal)/layout.tsx cùng dùng PageShell (header/footer).

Boundary:

- error.tsx và loading.tsx có mặt ở shop/products, shop/products/[id], shop/categories/[slug], portal/products-portal.
- app/not-found.tsx cho fallback 404 toàn app.

### Rendering strategy

Server Component (mặc định, không có use client):

- app/(marketing)/page.tsx
- app/(shop)/products/page.tsx
- app/(shop)/products/[id]/page.tsx
- app/(shop)/categories/[slug]/page.tsx
- app/(portal)/products-portal/page.tsx

Client Component:

- app/(shop)/favorites/page.tsx (use favorites store).
- features/products-portal/components/products-page.client.tsx.
- toolbar/dialog/table/mutation hooks ở products-portal.
- product-list-toolbar ở feature products cũng là client component.

Khi nào fetch server vs client:

- Shop pages fetch ở server qua `features/products/composition/products.container.ts` (đi qua application use-cases + adapter + API layer).
- Portal route prefetch server bằng QueryClient, sau đó client tiếp tục query/mutation qua React Query + axios.

Lý do chọn hybrid này (theo code):

- Catalog cần SEO và render ổn định nên server-first.
- Portal cần thao tác tương tác cao (CRUD, optimistic updates, URL sync tức thì) nên client-driven.

## 6. Data Flow của ứng dụng

### 6.1 Flow ở /products (shop)

Flow chính:

- URL search params
- parseProductSearchParams (Zod)
- searchProducts/getCategories (composition facade)
- application use-cases + products-http.repository
- products.endpoints + products.mappers map raw -> domain
- ProductGrid + Pagination render

Chi tiết:

- parseProductSearchParams trong features/products/lib/product.params.ts flatten string|string[] -> string rồi parse.
- search-products.use-case normalize params, repository chọn endpoint: /products/search, /products/category/:slug, /products.
- Cache strategy:
  - search dùng no-store.
  - list/category/categories dùng force-cache.
- buildProductsHref và buildCategoryHref tạo link phân trang dựa trên state đã parse.

### 6.2 Flow ở /products-portal (portal)

Flow chính:

- URL state qua nuqs (useQueryStates)
- toProductsSearchParams + normalizeProductsSearchParams
- query key productsKeys.list(params)
- productsQueries.list -> searchProducts endpoint
- products.mappers map raw -> domain
- ProductsTable + ProductsPagination render

Search/filter/pagination:

- Search box dùng debounce 400ms trong ProductsSearchBox.
- Đổi filter/sort reset page về 1 và update URL.
- Pagination update page qua setUrlState history push, shallow true.

Mutation flow:

- ProductFormDialog gọi create/update mutation.
- DeleteProductAlert gọi delete mutation với optimistic update trong onMutate.
- Sau mutate, query invalidation theo productsKeys để đồng bộ lại list/detail.

## 7. State Management

### Local state

Dùng useState cho state UI cục bộ, ví dụ:

- isAddDialogOpen, editingProduct, deletingProduct trong ProductsPortalPage.

### URL state

- Feature products: ProductListToolbar dùng useQueryStates(productsUrlState), shallow false để điều hướng đồng bộ URL.
- Feature products-portal: ProductsPortalPage dùng useQueryStates(productsUrlState) với history replace/push tùy hành động.
- Cả hai feature đã tách bộ option URL state thành hằng số dùng chung (PRODUCTS_URL_STATE_OPTS_FILTER/PAGE/RESET) trong:
  - features/products/lib/product-url-state.ts
  - features/products-portal/lib/products.url-state.ts

### Server state

- Chỉ dùng mạnh ở products-portal qua TanStack Query:
  - queries categories/list/detail.
  - staleTime khác nhau theo loại dữ liệu.
  - placeholderData giữ dữ liệu cũ khi param đổi.

### Global state

- Zustand chỉ dùng cho favorites:
  - lưu dạng Record<number, FavoriteProduct>.
  - persist localStorage key favorites-storage.
  - hook useFavorites bọc store + toast side effect.

Khi nào dùng loại state nào trong project:

- URL state: search/filter/sort/page để share link và giữ lịch sử điều hướng.
- Server state: dữ liệu API cần cache/refetch/invalidate.
- Global client state: sở thích người dùng cục bộ (favorites).
- Local state: mở/đóng dialog, chọn item đang edit/delete.

## 8. UI Pattern và Component Pattern

Mô hình tổ chức component:

- components/ui: primitive có thể dùng ở mọi nơi (Button, Input, Select, Table, Dialog...).
- components/shared: component nghiệp vụ dùng chung (PageShell, Pagination, EmptyState, ErrorState).
- features/\*/components: component đặc thù từng feature.

Pattern tái sử dụng thực tế:

- ProductGrid dùng ProductCard và nhận footerSlotForProduct để cắm FavoriteToggle hoặc action khác.
- Pagination shared dùng lại ở products list và category list.
- PageShell dùng chung cho shop và portal layout.

Container vs presentational:

- Container/orchestrator:
  - ProductsPortalPage: đọc URL state, gọi queries, quản lý dialog state, điều phối child components.
- Presentational:
  - ProductsTable, ProductsPagination, ProductsEmpty, ProductsError.

Sử dụng shadcn trong project:

- components/ui được scaffold theo components.json (style radix-nova, RSC true, CSS variables true).
- Feature components lắp ghép từ primitive shadcn thay vì style trực tiếp lặp lại.

## 9. Những điểm kiến trúc đáng chú ý

- Tách API model và domain model rõ ràng qua mappers ở cả 2 feature.
- Có schema validation ở nhiều điểm vào dữ liệu:
  - URL params.
  - API response.
  - form input create/update.
- Áp dụng URL-driven state cho tìm kiếm/lọc/phân trang thay vì state cục bộ khó share.
- Kết hợp server prefetch + hydration cho portal để giảm thời gian tải đầu trang.
- Có route-level loading/error boundary giúp fail-safe theo segment.

## Tóm tắt kiến trúc dự án

### Mô hình kiến trúc

- Feature-based modular architecture + layered design.
- Shop: server-first rendering với dữ liệu fetch ở server.
- Portal: client-driven rendering với TanStack Query + URL state + mutation.
- Shared design system qua components/ui + components/shared.

### Điểm mạnh

- Ranh giới feature rõ, dễ scale theo module.
- Validation và mapping tốt, giảm rủi ro lệch dữ liệu API.
- URL state được ưu tiên cho các tác vụ tìm kiếm/lọc/phân trang.
- Có route boundary loading/error, tăng độ bền UI khi lỗi mạng.
