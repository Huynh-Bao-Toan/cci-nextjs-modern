"use client";

import { useMemo, useState } from "react";
import { useQueryStates } from "nuqs";

import type { Product } from "../../domain/product.types";
import {
  PRODUCTS_URL_STATE_OPTS_PAGE,
  PRODUCTS_URL_STATE_OPTS_RESET,
} from "../lib/products.url-state";
import { toProductsSearchParams } from "../lib/products.url-state";
import { productsUrlState } from "../lib/products.url-state";
import { useCategoriesQuery } from "../hooks/use-categories-query";
import { useProductsQuery } from "../hooks/use-products-query";

import { ProductsPortalSkeleton } from "./products-skeleton";
import { ProductsToolbar } from "./products-toolbar";
import { ProductsTable } from "./products-table";
import { ProductsPagination } from "./products-pagination";
import { ProductFormDialog } from "./product-form-dialog";
import { DeleteProductAlert } from "./delete-product-alert";
import { ProductsEmpty } from "./products-empty";
import { ProductsError } from "./products-error";
import { Button } from "@/components/ui/button";

export function ProductsPortalPage() {
  const [urlState, setUrlState] = useQueryStates(productsUrlState, {
    shallow: true,
    history: "replace",
    scroll: false,
  });

  const params = useMemo(() => toProductsSearchParams(urlState), [urlState]);

  const categoriesQuery = useCategoriesQuery();
  const listQuery = useProductsQuery(params);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  if (categoriesQuery.isPending || listQuery.isPending) {
    return <ProductsPortalSkeleton />;
  }

  if (categoriesQuery.isError || listQuery.isError) {
    return (
      <ProductsError
        title="Failed to load products."
        description="Please try again."
        onRetry={() =>
          void Promise.all([categoriesQuery.refetch(), listQuery.refetch()])
        }
      />
    );
  }

  const categories = categoriesQuery.data ?? [];
  const pageData = listQuery.data;

  if (!pageData) return <ProductsPortalSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {pageData.items.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{pageData.total}</span>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingProduct(null);
            setIsAddDialogOpen(true);
          }}
        >
          Add product
        </Button>
      </div>

      <ProductsToolbar
        categories={categories}
        urlState={urlState}
        setUrlState={setUrlState}
      />

      {pageData.items.length > 0 ? (
        <>
          <ProductsTable
            items={pageData.items}
            onEdit={(product) => {
              setIsAddDialogOpen(false);
              setEditingProduct(product);
            }}
            onDelete={(product) => {
              setDeletingProduct(product);
            }}
          />
          <ProductsPagination
            page={params.page}
            pageSize={params.pageSize}
            total={pageData.total}
            onPageChange={(nextPage) =>
              setUrlState({ page: nextPage }, PRODUCTS_URL_STATE_OPTS_PAGE)
            }
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
              PRODUCTS_URL_STATE_OPTS_RESET,
            )
          }
        />
      )}

      <ProductFormDialog
        categories={categories}
        editingProduct={editingProduct}
        open={isAddDialogOpen || Boolean(editingProduct)}
        onOpenChange={(next) => {
          if (next) return;
          setIsAddDialogOpen(false);
          setEditingProduct(null);
        }}
      />
      <DeleteProductAlert
        deletingProduct={deletingProduct}
        open={Boolean(deletingProduct)}
        onOpenChange={(next) => {
          if (next) return;
          setDeletingProduct(null);
        }}
      />
    </div>
  );
}
