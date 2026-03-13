"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsError({ error, reset }: ProductsErrorProps) {
  useEffect(() => {
    console.error("Products route error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <ErrorState
        title="Unable to load products."
        description="There was a problem contacting the catalog API. Please try again in a moment."
        retryAction={
          <Button size="sm" onClick={reset}>
            Retry
          </Button>
        }
      />
    </main>
  );
}

