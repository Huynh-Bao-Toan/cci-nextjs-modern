import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";

import { ProductGrid } from "@/features/products/components/product-grid";
import { FavoriteToggle } from "@/features/products/components/favorite-toggle";
import { getCategories } from "@/features/products/server/get-categories";
import { getProducts } from "@/features/products/server/get-products";
import { parseProductSearchParams } from "@/features/products/lib/product.params";

export default async function CategoryPage(
  props: PageProps<"/categories/[slug]">,
) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const allCategories = await getCategories();
  const normalizedSlug = decodeURIComponent(params.slug);

  if (!allCategories.includes(normalizedSlug)) {
    notFound();
  }

  const parsedParams = parseProductSearchParams({
    ...searchParams,
    category: normalizedSlug,
  });

  const pageData = await getProducts(parsedParams);
  const hasResults = pageData.items.length > 0;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading
          title={normalizedSlug}
          subtitle="Products filtered by category, sharing the same listing UI."
        />
        <Link
          href="/products"
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Back to all products
        </Link>
      </div>

      {hasResults ? (
        <>
          <ProductGrid
            products={pageData.items}
            footerSlotForProduct={(product) => (
              <FavoriteToggle product={product} size="sm" />
            )}
          />
          <Pagination
            page={pageData.page}
            pageSize={pageData.pageSize}
            total={pageData.total}
            buildHref={(page) =>
              buildCategoryHref(normalizedSlug, {
                ...parsedParams,
                page,
              })
            }
          />
        </>
      ) : (
        <EmptyState
          title="No products found in this category."
          description="Try another category or go back to the full catalog."
          action={
            <Link
              href="/products"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Browse all products
            </Link>
          }
        />
      )}
    </main>
  );
}

function buildCategoryHref(
  slug: string,
  params: {
    q?: string;
    sort?: string;
    page: number;
    pageSize?: number;
    minRating?: number;
  },
) {
  const url = new URL(
    `/categories/${encodeURIComponent(slug)}`,
    "http://localhost",
  );
  if (params.q) url.searchParams.set("q", params.q);
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.minRating != null) {
    url.searchParams.set("minRating", String(params.minRating));
  }
  if (params.pageSize) {
    url.searchParams.set("pageSize", String(params.pageSize));
  }
  url.searchParams.set("page", String(params.page));
  return `${url.pathname}?${url.searchParams.toString()}`;
}
