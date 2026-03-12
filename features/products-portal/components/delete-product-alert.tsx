"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import type { Product } from "../domain/product.types"
import { useDeleteProductMutation } from "@/features/products-portal/hooks/use-delete-product-mutation"
import { productsToast } from "@/features/products-portal/lib/products.toast"
import { useProductsUiStore } from "@/features/products-portal/store/products-ui.store"

type DeleteProductAlertProps = {
  deletingProduct: Product | null
}

export function DeleteProductAlert({ deletingProduct }: DeleteProductAlertProps) {
  const deletingProductId = useProductsUiStore((s) => s.deletingProductId)
  const closeDeleteDialog = useProductsUiStore((s) => s.closeDeleteDialog)
  const mutation = useDeleteProductMutation()

  const open = Boolean(deletingProductId)

  const close = () => {
    if (mutation.isPending) return
    closeDeleteDialog()
  }

  const onConfirm = async () => {
    if (!deletingProductId) return
    try {
      await mutation.mutateAsync(deletingProductId)
      productsToast.deleted(deletingProduct?.title ?? `#${deletingProductId}`)
      closeDeleteDialog()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed"
      productsToast.error(message)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(next) => (next ? null : close())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is destructive. You can’t undo it.
            {deletingProduct ? (
              <span className="mt-1 block text-xs text-foreground">
                {deletingProduct.title}
              </span>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              void onConfirm()
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

