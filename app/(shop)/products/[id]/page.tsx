import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";

import { ProductGallery } from "@/features/products/presentation/components/product-gallery";
import { ProductPrice } from "@/features/products/presentation/components/product-price";
import { ProductGrid } from "@/features/products/presentation/components/product-grid";
import { FavoriteToggle } from "@/features/products/presentation/components/favorite-toggle";
import {
  getProductDetail,
  getRelatedProducts,
} from "@/features/products/composition/products.container";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    notFound();
  }

  const product = await getProductDetail(id);
  if (!product) {
    notFound();
  }

  const relatedPromise = getRelatedProducts(product.category, product.id);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.title },
        ]}
      />

      <section className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <ProductGallery product={product} />
        <div className="space-y-4">
          <SectionHeading title={product.title} />
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.brand && `${product.brand} · `}
            {product.category}
          </p>
          <div className="flex items-center justify-between gap-3">
            <ProductPrice product={product} />
            <FavoriteToggle product={product} />
          </div>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <dl className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Rating</dt>
              <dd className="font-medium">⭐ {product.rating.toFixed(1)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Stock</dt>
              <dd className="font-medium">{product.stock} units</dd>
            </div>
          </dl>
          {product.tags.length ? (
            <div className="flex flex-wrap gap-1 text-[11px] text-muted-foreground">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border bg-background px-2 py-0.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading
          title="Related products"
          subtitle="More from this category."
        />
        <SuspenseRelated relatedPromise={relatedPromise} />
      </section>
    </main>
  );
}

type RelatedProps = {
  relatedPromise: ReturnType<typeof getRelatedProducts>;
};

async function RelatedProducts({ relatedPromise }: RelatedProps) {
  const related = await relatedPromise;
  if (!related.length) {
    return (
      <p className="text-xs text-muted-foreground">
        No related products found for this item.
      </p>
    );
  }

  return <ProductGrid products={related} />;
}

import { Suspense } from "react";
import { ProductSkeleton } from "@/features/products/presentation/components/product-skeleton";

function SuspenseRelated({ relatedPromise }: RelatedProps) {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      }
    >
      <RelatedProducts relatedPromise={relatedPromise} />
    </Suspense>
  );
}
