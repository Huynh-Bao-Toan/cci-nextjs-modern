import { ClientCounterDemo } from "@/features/performance/components/client-counter-demo";
import { CachedProductsPanelWithFallback } from "@/features/performance/components/cached-products-panel";
import { RenderStrategyExplainer } from "@/features/performance/components/render-strategy-explainer";
import { StreamedRecommendations } from "@/features/performance/components/streamed-recommendations";

export default function LabPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Rendering & performance lab
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This page demonstrates how server components, client components,
          caching, Suspense streaming, and URL-driven state interplay in this
          mini commerce catalog.
        </p>
      </section>

      <RenderStrategyExplainer />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <CachedProductsPanelWithFallback />
          <StreamedRecommendations />
        </div>
        <div className="space-y-4">
          <ClientCounterDemo />
        </div>
      </div>
    </main>
  );
}

