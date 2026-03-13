"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/shared/error-state"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Let Next.js surface this in dev overlay; UI shows a clean message.
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <ErrorState
        title="Could not load products."
        description="Please try again. If the problem persists, check your network connection."
        retryAction={
          <Button type="button" onClick={reset}>
            Retry
          </Button>
        }
      />
    </main>
  )
}

