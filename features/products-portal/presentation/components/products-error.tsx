import { ErrorState } from "@/components/shared/error-state"
import { Button } from "@/components/ui/button"

type ProductsErrorProps = {
  title?: string
  description?: string
  onRetry: () => void
}

export function ProductsError({
  title = "Something went wrong.",
  description = "Please try again.",
  onRetry,
}: ProductsErrorProps) {
  return (
    <ErrorState
      title={title}
      description={description}
      retryAction={
        <Button type="button" onClick={onRetry}>
          Retry
        </Button>
      }
    />
  )
}

