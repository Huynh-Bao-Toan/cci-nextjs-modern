"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";

type CategoryErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function CategoryError({ error, reset }: CategoryErrorProps) {
  useEffect(() => {
    console.error("Category route error", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <ErrorState
        title="Unable to load category."
        description="There was a problem loading this category. It may not exist or the API is temporarily unavailable."
        retryAction={
          <Button size="sm" onClick={reset}>
            Retry
          </Button>
        }
      />
    </main>
  );
}

