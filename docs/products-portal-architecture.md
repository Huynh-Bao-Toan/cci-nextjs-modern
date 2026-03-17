# Tài liệu kiến trúc Product Portal

## 1. Mục tiêu

Tài liệu này mô tả cách module Product Portal đang được tổ chức theo hướng Clean Architecture trong dự án cci-nextjs-modern.

Phạm vi: toàn bộ thư mục features/products-portal.

Mục tiêu chính:

- Giải thích vai trò từng layer.
- Giải thích chiều phụ thuộc giữa các layer.
- Mô tả luồng dữ liệu khi đọc danh sách, xem chi tiết, tạo, sửa, xóa sản phẩm.
- Chỉ ra các điểm đã đạt và các điểm có thể cải thiện thêm.

## 2. Sơ đồ layer đang dùng

```text
UI / Presentation
  components/, hooks/, lib/products.queries.ts, lib/products.url-state.ts
          |
          v
Composition Root
  composition/products.container.ts
          |
          v
Application
  application/use-cases/* + application/ports/products.repository.ts
          |
          v
Domain
  domain/product.types.ts, domain/product.schemas.ts, domain/products.models.ts
          ^
          |
Adapter (implement port)
  adapters/products-http.repository.ts
          |
          v
Infrastructure/API
  api/products.client.ts, products.endpoints.ts, products.schemas.ts, products.mappers.ts, products.types.ts
```

Nguyên tắc quan trọng:

- Application chỉ phụ thuộc vào abstraction (port), không phụ thuộc concrete adapter.
- Adapter phụ thuộc vào API/infrastructure và map về domain model.
- UI gọi qua composition root để lấy use-case đã được wiring.

## 3. Cấu trúc thư mục và trách nhiệm

### 3.1 Domain

Thư mục: features/products-portal/domain

Trách nhiệm:

- Định nghĩa kiểu dữ liệu nghiệp vụ Product và các schema validate đầu vào.
- Định nghĩa model tìm kiếm, phân trang độc lập với backend transport.

Điểm nổi bật:

- products.models.ts dùng page và pageSize ở domain-level.
- product.schemas.ts dùng Zod để validate dữ liệu tạo/sửa và id.

### 3.2 Application

Thư mục: features/products-portal/application

Trách nhiệm:

- Chứa use-cases nghiệp vụ.
- Chứa port ProductsRepository làm contract cho data access.

Use-cases hiện có:

- search-products.use-case.ts: normalize và ràng buộc search params.
- get-categories.use-case.ts: chuẩn hóa categories (trim, lowercase, unique, sort).
- create/update/get-detail/delete: validate input id/payload trước khi gọi repository.

### 3.3 Adapter

Thư mục: features/products-portal/adapters

Trách nhiệm:

- Implement ProductsRepository bằng HTTP API cụ thể.
- Chuyển raw response sang domain model.
- Chuẩn hóa một số behavior của backend, ví dụ trả null nếu chi tiết không tồn tại (404).

### 3.4 Infrastructure/API

Thư mục: features/products-portal/api

Trách nhiệm:

- products.client.ts: cấu hình API client và error type.
- products.endpoints.ts: định nghĩa request HTTP, query params, endpoint path.
- products.schemas.ts và products.types.ts: định nghĩa shape raw từ backend.
- products.mappers.ts: parse raw bằng schema rồi map sang domain.

### 3.5 Composition Root

Thư mục: features/products-portal/composition

Trách nhiệm:

- Tạo concrete repository và nối vào các use-case.
- Cung cấp hàm facade để UI gọi, ví dụ searchProducts, createProduct.

Ý nghĩa kiến trúc:

- Việc wiring concrete dependency đã được đẩy ra ngoài Application.
- Đây là điểm quan trọng để giữ Dependency Rule đúng tinh thần Clean Architecture.

### 3.6 Presentation

Thư mục: features/products-portal/components, hooks, một phần lib

Trách nhiệm:

- components: table, toolbar, dialog, empty/error/skeleton.
- hooks: kết nối React Query và mutation lifecycle.
- lib/products.url-state.ts: đồng bộ filter/sort/page với URL qua nuqs.
- lib/products.queries.ts: cấu hình queryOptions và gọi hàm từ composition.

## 4. Luồng hoạt động runtime

## 4.1 Đọc danh sách sản phẩm

1. URL state được đọc bởi products-page.client.tsx qua nuqs.
2. State được chuyển thành ProductsSearchParams bằng toProductsSearchParams.
3. useProductsQuery gọi productsQueries.list(params).
4. productsQueries.list gọi searchProducts từ composition container.
5. Composition gọi searchProductsUseCase.
6. Use-case normalize params rồi gọi repo.searchProducts.
7. ProductsHttpRepository gọi API endpoint search/list/category.
8. Raw payload được parse + map sang PaginatedProducts domain model.
9. UI nhận domain model và render table/pagination.

## 4.2 Tạo hoặc sửa sản phẩm

1. Form submit từ ProductFormDialog.
2. Hook mutation gọi createProduct hoặc updateProduct qua container.
3. Use-case validate payload bằng schema domain.
4. Repository gọi API endpoint add/put.
5. Mapper parse raw và trả domain Product.
6. React Query invalidate query list để đồng bộ UI.

## 4.3 Xóa sản phẩm

1. DeleteProductAlert xác nhận thao tác.
2. Hook mutation gọi deleteProduct qua container.
3. Use-case validate id.
4. Repository gọi endpoint delete.
5. Trả về id đã xóa và trigger invalidate/refetch list.

## 5. Quy tắc phụ thuộc đang áp dụng

Quy tắc:

- Không cho domain/application phụ thuộc ngược vào API concrete.
- Port ở Application, implementation ở Adapter.
- Composition layer chịu trách nhiệm wiring.

Tình trạng hiện tại:

- Đã đạt: composition/products.container.ts đứng ngoài application và import concrete repository.
- Đã đạt: application/use-cases chỉ phụ thuộc port + domain.
- Đã đạt: adapter là nơi duy nhất biết API shape và endpoint chi tiết.

## 6. Điểm mạnh của kiến trúc hiện tại

- Tách biệt domain model và raw API model rõ ràng.
- Validate dữ liệu ở nhiều ranh giới quan trọng bằng Zod.
- Dễ thay adapter khác (mock, local, GraphQL, service khác) mà không đổi use-case.
- UI không phụ thuộc trực tiếp vào HTTP endpoint.
- Hỗ trợ test use-case độc lập bằng fake repository.

## 7. Điểm có thể cải thiện thêm

- products.queries.ts hiện nằm trong lib và chứa concern của React Query; có thể di chuyển sang hooks hoặc presentation/query để biên giới lớp rõ hơn.
- composition hiện dùng singleton repository ở module scope; nếu cần test hoặc runtime context đa môi trường, có thể chuyển sang factory container.
- Có thể thêm test contract cho ProductsRepository để bảo đảm adapter luôn trả về domain model đúng chuẩn.

## 8. Checklist đánh giá Clean Architecture

Checklist nhanh:

- Domain độc lập với framework: Đạt
- Use-case chỉ phụ thuộc abstraction: Đạt
- Adapter implement port: Đạt
- Composition root tách khỏi Application: Đạt
- Mapping raw to domain ở boundary: Đạt
- Presentation không phụ thuộc endpoint cụ thể: Đạt

Kết luận:

- Product Portal hiện đạt mức tốt theo Clean Architecture cho bối cảnh frontend module.
- Mức độ thực dụng cao, dễ mở rộng, dễ bảo trì và test.

## 9. Hướng dẫn mở rộng module đúng kiến trúc

Khi thêm một tính năng mới, ví dụ Bulk Update:

1. Thêm contract vào application/ports/products.repository.ts.
2. Tạo use-case mới trong application/use-cases.
3. Implement ở adapters/products-http.repository.ts.
4. Thêm endpoint và mapper tương ứng trong api/.
5. Nối dependency ở composition/products.container.ts.
6. Dùng từ hooks/components để render UI.
7. Thêm unit test cho use-case và mapper.

Làm theo thứ tự này sẽ giữ kiến trúc ổn định và tránh rò rỉ infrastructure vào domain/application.
