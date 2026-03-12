"use client"

import { useMemo } from "react"
import { useQueryStates } from "nuqs"

import type { Product } from "../domain/product.types"
import { toProductsSearchParams } from "../lib/products.url-state"
import { productsUrlState } from "../lib/products.url-state"
import { useCategoriesQuery } from "../hooks/use-categories-query"
import { useProductsQuery } from "../hooks/use-products-query"
import { useProductsUiStore } from "../store/products-ui.store"

import { ProductsPortalSkeleton } from "./products-skeleton"
import { ProductsToolbar } from "./products-toolbar"
import { ProductsTable } from "./products-table"
import { ProductsPagination } from "./products-pagination"
import { ProductFormDialog } from "./product-form-dialog"
import { DeleteProductAlert } from "./delete-product-alert"
import { ProductsEmpty } from "./products-empty"
import { ProductsError } from "./products-error"
import { Button } from "@/components/ui/button"

export function ProductsPortalPage() {
  const [urlState, setUrlState] = useQueryStates(productsUrlState, {
    shallow: true,
    history: "replace",
  })

  const params = useMemo(() => toProductsSearchParams(urlState), [urlState])

  const categoriesQuery = useCategoriesQuery()
  const listQuery = useProductsQuery(params)

  const openAddDialog = useProductsUiStore((s) => s.openAddDialog)
  const editingProductId = useProductsUiStore((s) => s.editingProductId)
  const deletingProductId = useProductsUiStore((s) => s.deletingProductId)

  const selectedEditing = useMemo<Product | null>(() => {
    if (!editingProductId) return null
    return (listQuery.data?.items ?? []).find((p) => p.id === editingProductId) ?? null
  }, [editingProductId, listQuery.data?.items])

  const selectedDeleting = useMemo<Product | null>(() => {
    if (!deletingProductId) return null
    return (listQuery.data?.items ?? []).find((p) => p.id === deletingProductId) ?? null
  }, [deletingProductId, listQuery.data?.items])

  if (categoriesQuery.isPending || listQuery.isPending) {
    return <ProductsPortalSkeleton />
  }

  if (categoriesQuery.isError || listQuery.isError) {
    return (
      <ProductsError
        title="Failed to load products."
        description="Please try again."
        onRetry={() => void Promise.all([categoriesQuery.refetch(), listQuery.refetch()])}
      />
    )
  }

  const categories = categoriesQuery.data ?? []
  const pageData = listQuery.data

  if (!pageData) return <ProductsPortalSkeleton />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-medium text-foreground">{pageData.items.length}</span>{" "}
          of <span className="font-medium text-foreground">{pageData.total}</span>
        </div>
        <Button type="button" size="sm" onClick={openAddDialog}>
          Add product
        </Button>
      </div>

      <ProductsToolbar categories={categories} />

      {pageData.items.length > 0 ? (
        <>
          <ProductsTable items={pageData.items} />
          <ProductsPagination
            page={params.page}
            limit={params.limit}
            total={pageData.total}
          />
        </>
      ) : (
        <ProductsEmpty
          onReset={() =>
            setUrlState(
              {
                q: null,
                category: null,
                sortBy: null,
                sortOrder: null,
                page: 1,
              },
              { history: "push", shallow: true, scroll: false }
            )
          }
        />
      )}

      <ProductFormDialog categories={categories} editingProduct={selectedEditing} />
      <DeleteProductAlert deletingProduct={selectedDeleting} />
    </div>
  )
}

