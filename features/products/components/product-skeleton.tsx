import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border bg-card p-3">
      <Skeleton className="mb-3 h-40 w-full rounded-lg" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-1 h-3 w-1/2" />
      <Skeleton className="mb-3 h-3 w-2/3" />
      <Skeleton className="h-8 w-full rounded-md" />
    </div>
  );
}

