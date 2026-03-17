import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"

type ProductsEmptyProps = {
  onReset: () => void
}

export function ProductsEmpty({ onReset }: ProductsEmptyProps) {
  return (
    <EmptyState
      title="No products found."
      description="Try adjusting your search, filters, or reset them to explore the full catalog."
      action={
        <Button type="button" variant="outline" size="sm" onClick={onReset}>
          Reset filters
        </Button>
      }
    />
  )
}

