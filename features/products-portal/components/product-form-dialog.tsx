"use client"

import { useEffect, useId, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Product } from "../domain/product.types"
import {
  createProductInputSchema,
  updateProductInputSchema,
} from "../domain/product.schemas"
import type { CreateProductInput, UpdateProductInput } from "../api/products.types"
import { useCreateProductMutation } from "@/features/products-portal/hooks/use-create-product-mutation"
import { useUpdateProductMutation } from "@/features/products-portal/hooks/use-update-product-mutation"
import { productsToast } from "@/features/products-portal/lib/products.toast"

type ProductFormDialogProps = {
  categories: string[]
  editingProduct: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ProductFormValues = {
  title?: string
  description?: string
  price?: number | string
  stock?: number | string
  brand?: string
  category?: string
  thumbnail?: string
}

export function ProductFormDialog({
  categories,
  editingProduct,
  open,
  onOpenChange,
}: ProductFormDialogProps) {
  const formId = useId()
  const isEdit = Boolean(editingProduct)

  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()

  const schema = isEdit ? updateProductInputSchema : createProductInputSchema

  const defaultValues = useMemo<ProductFormValues>(
    () => ({
      title: editingProduct?.title ?? "",
      description: editingProduct?.description ?? "",
      price: editingProduct?.price ?? 0,
      stock: editingProduct?.stock ?? 0,
      brand: editingProduct?.brand ?? "",
      category: editingProduct?.category ?? "",
      thumbnail: editingProduct?.thumbnailUrl ?? "",
    }),
    [editingProduct]
  )

  const form = useForm<ProductFormValues>({
    // The schema switches between create/update, and zodResolver typing can be
    // overly strict across Zod versions. Runtime validation is still guaranteed
    // by the schema + explicit parse() in onSubmit.
    resolver: zodResolver(schema as never) as never,
    defaultValues,
  })

  useEffect(() => {
    if (!open) return
    form.reset(defaultValues)
  }, [defaultValues, form, open])

  const isPending = createMutation.isPending || updateMutation.isPending

  const close = () => {
    onOpenChange(false)
    form.reset(defaultValues)
  }

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEdit && editingProduct) {
        const input: UpdateProductInput = updateProductInputSchema.parse(values)
        const updated = await updateMutation.mutateAsync({
          id: editingProduct.id,
          input,
        })
        productsToast.updated(updated.title)
      } else {
        const input: CreateProductInput = createProductInputSchema.parse(values)
        const created = await createMutation.mutateAsync(input)
        productsToast.created(created.title)
      }
      close()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request failed"
      productsToast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update product" : "Add new product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update fields and save changes."
              : "Create a new product in the DummyJSON catalog."}
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
          <FieldGroup className="gap-3">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-title`}>Title</FieldLabel>
                  <Input
                    {...field}
                    id={`${formId}-title`}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. iPhone 15"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-category`}>Category</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id={`${formId}-category`}
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-price`}>Price</FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-price`}
                      aria-invalid={fieldState.invalid}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="stock"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-stock`}>Stock</FieldLabel>
                    <Input
                      {...field}
                      id={`${formId}-stock`}
                      aria-invalid={fieldState.invalid}
                      type="number"
                      inputMode="numeric"
                      min={0}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-brand`}>Brand</FieldLabel>
                  <Input
                    {...field}
                    id={`${formId}-brand`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Optional"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="thumbnail"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-thumbnail`}>Thumbnail URL</FieldLabel>
                  <Input
                    {...field}
                    id={`${formId}-thumbnail`}
                    aria-invalid={fieldState.invalid}
                    placeholder="https://..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={`${formId}-description`}
                    aria-invalid={fieldState.invalid}
                    placeholder="Optional"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={close} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form={formId} disabled={isPending}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

