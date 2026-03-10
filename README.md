# Tổng quan dự án

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

### Axios (`axios`)

- **`axios`**: HTTP client (REST) hỗ trợ interceptors, timeout, baseURL, transform request/response.
- **Khi dùng**:
  - Khi bạn muốn một HTTP client thống nhất cho cả client/server (ví dụ gọi API nội bộ/3rd party), có interceptors cho auth/refresh token.
  - Dùng làm “transport layer” dưới TanStack Query (tức `queryFn`/`mutationFn` gọi axios).
- **Best practice & khi dùng**:
  - Tạo 1 instance dùng chung trong `lib/http/*` (ví dụ `lib/http/axios.ts`) để cấu hình `baseURL`, headers, interceptors.
  - Không gọi axios trực tiếp khắp nơi trong UI; ưu tiên đi qua:
    - `lib/api/*` (các hàm gọi API), sau đó
    - TanStack Query hooks để quản lý server state.
  - Với Next App Router, cân nhắc phân tách:
    - **Server-to-server** (Route Handler / Server Action) gọi axios với secret/token server.
    - **Client** chỉ gọi những endpoint an toàn, hoặc gọi thông qua route handler.

### nuqs (`nuqs`)

- **`nuqs`**: quản lý state đồng bộ với **URL query string** (search params) trong Next.js.
- **Khi dùng**:
  - Filter/sort/pagination/search… mà bạn muốn:
    - share link được,
    - back/forward giữ đúng state,
    - reload vẫn giữ state.
- **Best practice**:
  - Dùng nuqs cho state “URL-driven” (filters, tab, page, perPage) thay vì đưa vào Zustand.
  - Kết hợp với TanStack Query: đưa queryKey phụ thuộc search params để caching đúng theo URL.

### date-fns (`date-fns`)

- **`date-fns`**: tiện ích xử lý ngày giờ theo kiểu functional, import theo hàm để bundle nhỏ.
- **Khi dùng**:
  - Format ngày giờ hiển thị UI, parse/compare/rounding, tính khoảng thời gian (relative time), v.v.
- **Best practice**:
  - Import theo hàm: `import { format, parseISO } from 'date-fns'` (tránh import cả package).
  - Chuẩn hoá timezone/ISO string ở layer API/domain (ưu tiên lưu trữ dạng ISO), UI chỉ format/hiển thị.

### Zod (`zod`)

- **`zod`**: thư viện định nghĩa schema + validate dữ liệu **TypeScript-first**, có static type inference.
- **Best practice & khi dùng**:
  - Định nghĩa **schema domain** (User, Product, Filter, Payload API, v.v.) ở các layer phù hợp (`lib/schemas/*`, `features/*/schemas.ts`).
  - Validate **input**:
    - Dữ liệu đến từ form (kết hợp với `react-hook-form` resolver).
    - Dữ liệu đến từ API ngoài (đảm bảo data đúng shape trước khi dùng).
    - Params từ URL, query string, search params.
  - Tái sử dụng type: `z.infer<typeof schema>` để đảm bảo type domain **đồng nhất** giữa UI, server actions, API clients.
  - Hạn chế duplicate type giữa TypeScript type & validation logic – luôn “đi từ schema Zod ra type” thay vì tự viết 2 lần.

### React Hook Form (`react-hook-form`)

- **`react-hook-form`**: thư viện quản lý form tối ưu performance, dùng hooks, không re-render toàn bộ form mỗi lần gõ.
- **Best practice & khi dùng**:
  - Tạo **form component** riêng trong `components/` hoặc `features/*/components/` (ví dụ: `LoginForm`, `ProfileForm`, `FilterForm`).
  - Luôn define **schema validate** bằng Zod và dùng `zodResolver` (từ `@hookform/resolvers/zod`) để:
    - Tách bạch phần UI form và kiểu dữ liệu/validate.
    - Nhận error message cấu trúc rõ ràng, dễ map ra UI.
  - Dùng `useForm` cho logic form local; **chỉ** đưa data form lên Zustand khi thực sự cần share nhiều màn hoặc giữ state qua nhiều bước wizard.
  - Khi submit:
    - Gọi **TanStack Query mutation** hoặc server action, dùng schema Zod để đảm bảo payload hợp lệ trước khi gọi API.

### es-toolkit (`es-toolkit`)

- **`es-toolkit`**: thư viện utility JavaScript hiện đại, thay thế lodash với bundle nhỏ hơn (tới ~97%) và hiệu năng tốt hơn 2–3 lần.
- **Các nhóm chức năng**:
  - **Array**: `uniq`, `difference`, `groupBy`, `sortBy`, v.v.
  - **Function**: `debounce`, `throttle`, `once`, `after`, v.v.
  - **Math**: `sum`, `round`, `clamp`, v.v.
  - **Object**: `pick`, `omit`, `deepMerge`, v.v.
  - **Predicate**: `isNotNil`, `isPlainObject`, v.v.
  - **Promise**: `delay`, `retry`, v.v.
  - **String**: `snakeCase`, `camelCase`, `truncate`, v.v.
- **Best practice & khi dùng**:
  - Import theo subpath để tree-shaking tốt: `import { debounce } from 'es-toolkit/function'`, `import { pick } from 'es-toolkit/object'`.
  - Dùng thay cho lodash khi cần: array/object/string manipulation, debounce/throttle, delay, type guards.
  - Đặt logic dùng es-toolkit trong `lib/` hoặc hooks; tránh import trực tiếp trong component nếu có thể gom vào helper.

### Zustand (`zustand`)

- **`zustand`**: state management cho **client state**/UI state.
- **Khi dùng**:
  - State không đến từ server, ví dụ:
    - UI: theme, sidebar open, modal open, wizard step.
    - Business state nhỏ: filter trong trang, tạm giữ form state nhiều bước.
  - Cần share state giữa nhiều components mà không muốn pass props sâu.
  - Không dùng cho data fetch từ API (trường hợp đó ưu tiên TanStack Query).

### Vitest & Testing Library (unit test)

- **`vitest`**: test runner hiện đại, API tương tự Jest nhưng tích hợp tốt với Vite.
- **`@vitejs/plugin-react`**, **`vite-tsconfig-paths`**: cấu hình Vitest/Vite để hiểu JSX/TSX và alias từ `tsconfig.json` (như `@/components/...`). Xem `vitest.config.mts`:
  - môi trường test là **`jsdom`**, phù hợp test component React

- **`@testing-library/react`**, **`@testing-library/dom`**: bộ công cụ test UI theo hướng **user-centric** (query theo role, text, label…).
- **`jsdom`**: giả lập DOM trong Node để test component React mà không cần browser thật.
- **Best practice**:
  - Viết test cho:
    - Các page/feature quan trọng trong `app/` (ví dụ `app/__tests__/*`).
    - Components tái sử dụng trong `components/` (ví dụ `components/__tests__/*`).
  - Ưu tiên test theo **hành vi người dùng** (click, nhập input, text hiển thị) thay vì implementation detail.
  - Sử dụng `pnpm test` để chạy toàn bộ test suite, tích hợp vào CI.

### Playwright (end-to-end test)

- **`@playwright/test`**: framework E2E test chạy trên **trình duyệt thật** (Chromium, Firefox, WebKit) với API thân thiện.
- Cấu hình chính nằm ở `playwright.config.ts`:
  - `testDir: './tests'`: tất cả E2E test nằm trong thư mục `tests/` (ví dụ `tests/example.spec.ts`).
  - Chạy song song (`fullyParallel: true`), retry tự động trên CI, reporter dạng HTML.
  - Có sẵn cấu hình cho 3 browser chính: Desktop Chrome, Firefox, Safari.
- **Các lệnh hữu ích (chạy trong root project)**:
  - `pnpm exec playwright test`: chạy toàn bộ E2E tests.
  - `pnpm exec playwright test --ui`: mở giao diện UI mode để xem/chạy test tương tác.
  - `pnpm exec playwright test --project=chromium`: chỉ chạy trên Desktop Chrome.
  - `pnpm exec playwright test example`: chỉ chạy file/nhóm test có tên `example`.
  - `pnpm exec playwright test --debug`: chạy test ở debug mode (dừng từng bước, inspector).
  - `pnpm exec playwright codegen`: auto generate test từ session duyệt web thực tế.
- **Best practice & khi dùng**:
  - Dùng cho **end-to-end flow** quan trọng: login, checkout, form nhiều bước, navigation chính.
  - Giữ test E2E ở mức **ít nhưng chất lượng cao**; phần logic chi tiết nên test bằng unit/integration (Vitest + Testing Library).
  - Kết hợp với `webServer` trong `playwright.config.ts` (khi cần) để tự start app trước khi chạy test E2E.

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

---

## Environment variables (3 môi trường)

Next.js tự động nạp biến môi trường theo `NODE_ENV` từ các file `.env*` (theo thứ tự ưu tiên):

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local` (KHÔNG được load khi `NODE_ENV=test`)
4. `.env.$(NODE_ENV)`
5. `.env`

Repo đã có sẵn các file ví dụ:

- **Development (dev local)**: `.env.development.example`
- **Production**: `.env.production.example`
- **Test (UAT/BETA)**: `.env.test.example`
- **Base defaults**: `.env.example`

Lưu ý quan trọng:

- Chỉ biến có prefix **`NEXT_PUBLIC_`** mới có thể dùng an toàn ở client. Các biến này sẽ được “inline” vào bundle khi `next build` (đổi env sau khi build sẽ không có tác dụng cho client).
- Biến **không** có `NEXT_PUBLIC_` chỉ dùng ở server (Route Handlers, Server Components/Actions, v.v.).

### Cách dùng nhanh (Windows PowerShell)

- **Development (local)**:
  - Copy `.env.development.example` → `.env.development.local` (hoặc `.env.local`)
  - Chạy: `pnpm dev`

- **Production (mô phỏng local)**:
  - Copy `.env.production.example` → `.env.production.local`
  - Chạy:
    - `$env:NODE_ENV="production"; pnpm build`
    - `$env:NODE_ENV="production"; pnpm start`

- **Test (UAT/BETA)**:
  - Copy `.env.test.example` → `.env.test` (và/hoặc `.env.test.local`)
  - Chạy:
    - `$env:NODE_ENV="test"; pnpm build`
    - `$env:NODE_ENV="test"; pnpm start`
