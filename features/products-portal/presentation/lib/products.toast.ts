"use client"

import "client-only"

import { toast } from "sonner"

export const productsToast = {
  created: (title: string) =>
    toast.success("Product created", { description: title }),
  updated: (title: string) =>
    toast.success("Product updated", { description: title }),
  deleted: (title: string) =>
    toast.success("Product deleted", { description: title }),
  error: (message: string) => toast.error(message),
}

