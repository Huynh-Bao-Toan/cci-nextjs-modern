"use client"

import { Button } from "@/components/ui/button"

type ProductsPaginationProps = {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
}

export function ProductsPagination({
  page,
  limit,
  total,
  onPageChange,
}: ProductsPaginationProps) {
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
          onClick={() => onPageChange(Math.max(1, clamped - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={clamped === pageCount}
          onClick={() => onPageChange(Math.min(pageCount, clamped + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

