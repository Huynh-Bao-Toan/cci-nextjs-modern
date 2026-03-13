"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";

type ProductDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductDetailError({
  error,
  reset,
}: ProductDetailErrorProps) {
  useEffect(() => {
    console.error("Product detail route error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <ErrorState
        title="Unable to load product."
        description="There was a problem loading this product. It may have been removed or the API is temporarily unavailable."
        retryAction={
          <Button size="sm" onClick={reset}>
            Retry
          </Button>
        }
      />
    </main>
  );
}

