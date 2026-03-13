import { LoadingSkeleton } from "@/components/shared/loading-skeleton"

export function ProductsPortalSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
        <LoadingSkeleton className="h-4 w-40" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <LoadingSkeleton className="h-8 flex-1" />
          <LoadingSkeleton className="h-8 w-44" />
          <LoadingSkeleton className="h-8 w-44" />
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-6 gap-2 border-b p-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

