"use client"

import { useQueryStates } from "nuqs"

import { Button } from "@/components/ui/button"

import { productsUrlState } from "../lib/products.url-state"

type ProductsPaginationProps = {
  page: number
  limit: number
  total: number
}

export function ProductsPagination({ page, limit, total }: ProductsPaginationProps) {
  const [, setUrlState] = useQueryStates(productsUrlState)

  const pageCount = Math.max(1, Math.ceil(total / limit))
  if (pageCount <= 1) return null

  const clamped = Math.min(Math.max(page, 1), pageCount)

  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
      <div>
        Page <span className="font-medium text-foreground">{clamped}</span> of{" "}
        <span className="font-medium text-foreground">{pageCount}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={clamped === 1}
          onClick={() =>
            setUrlState(
              { page: Math.max(1, clamped - 1) },
              { history: "push", shallow: true, scroll: false }
            )
          }
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={clamped === pageCount}
          onClick={() =>
            setUrlState(
              { page: Math.min(pageCount, clamped + 1) },
              { history: "push", shallow: true, scroll: false }
            )
          }
        >
          Next
        </Button>
      </div>
    </div>
  )
}

