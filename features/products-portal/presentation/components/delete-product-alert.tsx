"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Product } from "../../domain/product.types";
import { useDeleteProductMutation } from "@/features/products-portal/presentation/hooks/use-delete-product-mutation";
import { productsToast } from "@/features/products-portal/presentation/lib/products.toast";

type DeleteProductAlertProps = {
  deletingProduct: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteProductAlert({
  deletingProduct,
  open,
  onOpenChange,
}: DeleteProductAlertProps) {
  const mutation = useDeleteProductMutation();

  const close = () => {
    if (mutation.isPending) return;
    onOpenChange(false);
  };

  const onConfirm = async () => {
    if (!deletingProduct) return;
    try {
      await mutation.mutateAsync(deletingProduct.id);
      productsToast.deleted(deletingProduct.title);
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed";
      productsToast.error(message);
    }
  };

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
              e.preventDefault();
              void onConfirm();
            }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
