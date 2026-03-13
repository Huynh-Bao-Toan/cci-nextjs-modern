import { describe, expect, it, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type React from "react"

type GlobalWithSelectMock = typeof globalThis & {
  __onValueChange?: (value: string) => void
}

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode
    onValueChange?: (value: string) => void
  }) => {
    ;(globalThis as GlobalWithSelectMock).__onValueChange = onValueChange
    return <div>{children}</div>
  },
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => (
    <button
      type="button"
      onClick={() => (globalThis as GlobalWithSelectMock).__onValueChange?.(value)}
    >
      {children}
    </button>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
}))

const mutateAsync = vi.fn(async () => ({
  id: 101,
  title: "Created",
  description: "",
  price: 1,
  discountPercentage: 0,
  rating: 0,
  stock: 1,
  brand: "",
  category: "phones",
  thumbnailUrl: "https://example.com/a.png",
  imageUrls: [],
  tags: [],
}))

vi.mock("@/features/products-portal/hooks/use-create-product-mutation", () => ({
  useCreateProductMutation: () => ({ mutateAsync, isPending: false }),
}))

vi.mock("@/features/products-portal/hooks/use-update-product-mutation", () => ({
  useUpdateProductMutation: () => ({ mutateAsync: vi.fn(), isPending: false }),
}))

vi.mock("@/features/products-portal/lib/products.toast", () => ({
  productsToast: {
    created: vi.fn(),
    updated: vi.fn(),
    deleted: vi.fn(),
    error: vi.fn(),
  },
}))

import { ProductFormDialog } from "@/features/products-portal/components/product-form-dialog"

describe("ProductFormDialog", () => {
  beforeEach(() => {
    mutateAsync.mockClear()
  })

  it("submits create form", async () => {
    const user = userEvent.setup()

    render(
      <ProductFormDialog
        categories={["phones"]}
        editingProduct={null}
        open
        // Dialog open is fully controlled by the test in this case.
        onOpenChange={() => {}}
      />
    )

    await user.type(screen.getByLabelText(/title/i), "My product")
    await user.click(screen.getByRole("button", { name: "phones" }))
    await user.clear(screen.getByLabelText(/price/i))
    await user.type(screen.getByLabelText(/price/i), "12")
    await user.clear(screen.getByLabelText(/stock/i))
    await user.type(screen.getByLabelText(/stock/i), "2")

    await user.click(screen.getByRole("button", { name: /create product/i }))

    expect(mutateAsync).toHaveBeenCalled()
  })
})

