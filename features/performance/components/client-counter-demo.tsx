"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ClientCounterDemo() {
  const [count, setCount] = useState(0);

  return (
    <section className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Client component</h2>
          <p className="text-xs text-muted-foreground">
            Local interactive state lives only in the browser and does not affect
            server rendering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tabular-nums">{count}</span>
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => setCount((value) => value + 1)}
          >
            Increment
          </Button>
        </div>
      </div>
    </section>
  );
}

