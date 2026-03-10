import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist or may have been moved."
        action={
          <Link
            href="/"
            className="text-xs font-medium text-primary underline-offset-2 hover:underline"
          >
            Go back home
          </Link>
        }
      />
    </main>
  );
}

