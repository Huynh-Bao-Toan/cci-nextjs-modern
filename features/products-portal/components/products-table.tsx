"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { Product } from "../domain/product.types"

type ProductsTableProps = {
  items: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsTable({ items, onEdit, onDelete }: ProductsTableProps) {

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[220px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Rating</TableHead>
            <TableHead className="w-28 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <img
                    src={p.thumbnailUrl}
                    alt=""
                    className="size-8 rounded-md border object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="truncate">{p.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {p.brand || "—"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{p.category}</Badge>
              </TableCell>
              <TableCell className="text-right">${p.price}</TableCell>
              <TableCell className="text-right">{p.stock}</TableCell>
              <TableCell className="text-right">{p.rating.toFixed(1)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(p)}
                    aria-label={`Edit ${p.title}`}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(p)}
                    aria-label={`Delete ${p.title}`}
                  >
                    <Trash2Icon className="size-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

