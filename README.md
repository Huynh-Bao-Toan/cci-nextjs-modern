## Tổng quan dự án

**cci-nextjs-modern** là bộ khởi tạo (boilerplate) Next.js 16 (App Router) với React 19, Tailwind CSS 4 và một số thư viện UI/state hiện đại, được thiết kế theo hướng **clean architecture**:

- **`app/`**: định nghĩa route, layout, entry UI.
- **`components/`**: các UI components tái sử dụng (shadcn UI, button, form, v.v.).
- **`providers/`**: các provider cho toàn ứng dụng (ví dụ: `QueryProvider` cho TanStack Query).
- **`stores/`**: global state với Zustand.
- **`styles/`**: fonts, global CSS, token/biến thiết kế.
- **`lib/`**: helpers, utilities thuần logic (không phụ thuộc UI).

---

## Cấu trúc thư mục chính

### `app/`

- **Vai trò**: App Router layer – định nghĩa route, layout, metadata, và ghép các provider/boundary.
- Ví dụ:
  - `app/layout.tsx`: root layout, nơi bọc `<QueryProvider>` và các provider khác.
  - `app/page.tsx`: trang chính (`/`), render UI sử dụng components, stores, server data.
- **Nguyên tắc**:
  - Không nhét business logic phức tạp vào `app/`.
  - Chỉ ghép (compose) components, providers, hooks đến từ `components/`, `stores/`, `lib/`.

### `components/`

- **Vai trò**: Thư viện UI tái sử dụng.
- Ví dụ:
  - `components/ui/button.tsx`: button chuẩn hoá theo shadcn UI + Tailwind.
- **Khi dùng**:
  - Bất cứ UI nào có thể dùng lại nhiều nơi → đưa vào `components/`.
  - Tránh đưa logic hạ tầng (TanStack Query, Zustand) trực tiếp vào đây; chỉ nhận props hoặc dùng hooks domain khi cần.

### `providers/`

- **Vai trò**: chứa các provider “cross-cutting” cho toàn app.
- Ví dụ:
  - `providers/query-provider.tsx`: cấu hình `QueryClient`, `QueryClientProvider` và `ReactQueryDevtools`.
- **Khi dùng**:
  - Cần bọc toàn bộ ứng dụng bằng 1 context/provider (TanStack Query, theming, i18n, v.v.).
  - `app/layout.tsx` sẽ import provider từ đây, đảm bảo `app/` chỉ là nơi lắp ghép.

### `stores/`

- **Vai trò**: global state, domain state dùng Zustand.
- Ví dụ:
  - `stores/ui-preferences-store.ts`: state cho UI (theme, v.v.).
- **Khi dùng**:
  - State cần dùng ở nhiều route/components (UI state hoặc business state nhỏ gọn).
  - Không phù hợp cho server state (data fetch từ API) → ưu tiên TanStack Query.

### `styles/`

- **Vai trò**: style layer.
- Ví dụ:
  - `styles/globals.css`: global styles, base styles của Tailwind.
  - `styles/fonts.ts`: cấu hình `next/font` (Geist, v.v.).
- **Khi dùng**:
  - Thêm custom CSS, biến CSS, cấu hình fonts, design tokens.

### `lib/`

- **Vai trò**: helper, utilities thuần logic.
- Ví dụ:
  - `lib/utils.ts`: `cn` helper để merge className, v.v.
- **Khi dùng**:
  - Đặt các hàm không phụ thuộc UI, có thể reuse ở mọi layer.

---

## Các thư viện chính và khi nào sử dụng

### Next.js & React

- **`next`**: framework chính, App Router, routing, server components, data fetching.
- **`react`, `react-dom`**: core UI library.
- **Khi dùng**:
  - Tất cả phần UI, routing, server actions, metadata… đều dựa trên 2 thư viện này.

### Tailwind & hệ sinh thái UI

- **`tailwindcss`**: utility-first CSS framework.
- **`@tailwindcss/postcss`**: integration với PostCSS.
- **`clsx`**: helper để conditionally merge className.
- **`tailwind-merge`**: merge Tailwind class, ưu tiên class “sau cùng” (giải quyết xung đột).
- **`class-variance-authority` (CVA)**: định nghĩa variants (size, variant, state) cho components một cách type-safe.
- **`tw-animate-css`**: tập trung các animation tiện dùng với Tailwind.
- **`radix-ui`**: primitives UI (Popover, Dialog, Menu, v.v.).
- **`lucide-react`**: bộ icon React.
- **Khi dùng**:
  - Tất cả UI layout & styling: Tailwind + `clsx` + `tailwind-merge`.
  - Components phức tạp: dùng Radix primitives, bọc lại trong `components/ui/*`.
  - Tạo button/card/input có nhiều variants: dùng `class-variance-authority`.
  - Cần icon: import từ `lucide-react`.

### shadcn UI

- **`shadcn`**: tool scaffolding để generate UI components Tailwind + Radix (không phải runtime lib).
- **Khi dùng**:
  - Tạo nhanh components chuẩn (Button, Input, Dialog, v.v.) → code được generate vào `components/ui/*`, sau đó bạn chỉnh sửa tự do.

### TanStack Query (`@tanstack/react-query` + devtools)

- **`@tanstack/react-query`**: quản lý **server state** (data từ API/back-end), caching, revalidation, pagination, mutation.
- **`@tanstack/react-query-devtools`** (devDependency): Devtools UI để debug query/mutation (chỉ dùng dev).
- **Khi dùng**:
  - Data fetch từ API REST/GraphQL/HTTP mà:
    - Cần caching.
    - Cần refetch theo event (focus, network, invalidate).
    - Cần pagination/infinite scroll.
  - Dùng hooks như `useQuery`, `useMutation`, `useInfiniteQuery` trong **client components**.
  - Debug state query/mutation bằng Devtools.

### Zustand (`zustand`)

- **`zustand`**: state management cho **client state**/UI state.
- **Khi dùng**:
  - State không đến từ server, ví dụ:
    - UI: theme, sidebar open, modal open, wizard step.
    - Business state nhỏ: filter trong trang, tạm giữ form state nhiều bước.
  - Cần share state giữa nhiều components mà không muốn pass props sâu.
  - Không dùng cho data fetch từ API (trường hợp đó ưu tiên TanStack Query).

### ESLint, TypeScript và công cụ dev

- **`typescript`**: typing, an toàn code.
- **`eslint`, `eslint-config-next`**: linting, best practices của Next.js.
- **`@tanstack/eslint-plugin-query`**: rule lint riêng cho TanStack Query (tránh bug về deps, stale closure, v.v.).
- **`@types/*`**: type definitions cho Node/React/ReactDOM.
- **Khi dùng**:
  - Chạy `pnpm lint` trước khi commit/deploy.
  - Đảm bảo hooks TanStack Query tuân thủ best practices (ESLint plugin).

---

## Hướng dẫn sử dụng ngắn

- **Server state (API data)** → dùng **TanStack Query** (trong client component, đã được bọc bởi `QueryProvider` trong `app/layout.tsx`).
- **UI/client state dùng chung** → tạo store trong `stores/` với **Zustand**, import hook vào component client.
- **UI component tái sử dụng** → tạo trong `components/ui/` (ưu tiên pattern shadcn + Tailwind + Radix).
- **Logic thuần, không phụ thuộc UI** → đặt trong `lib/`.