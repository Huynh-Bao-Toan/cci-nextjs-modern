import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";

import { getCategories } from "@/features/products/server/get-categories";
import { getProducts } from "@/features/products/server/get-products";
import { ProductGrid } from "@/features/products/components/product-grid";
import { FavoriteToggle } from "@/features/products/components/favorite-toggle";
import { ProductListToolbar } from "@/features/products/components/product-list-toolbar";
import { parseProductSearchParams } from "@/features/products/lib/product-query-params";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = parseProductSearchParams(resolvedSearchParams);
  const [categories, pageData] = await Promise.all([
    getCategories(),
    getProducts(parsedParams),
  ]);

  const hasResults = pageData.items.length > 0;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <SectionHeading
          title="Products"
          subtitle="Browse products from the DummyJSON catalog. Filters are shareable through the URL."
        />
        <Link
          href="/favorites"
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          View favorites
        </Link>
      </div>

      <ProductListToolbar categories={categories} />

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
              buildProductsHref({
                ...parsedParams,
                page,
              })
            }
          />
        </>
      ) : (
        <EmptyState
          title="No products found."
          description="Try adjusting your search, filters, or reset them to explore the full catalog."
          action={
            <Link
              href="/products"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Reset filters
            </Link>
          }
        />
      )}
    </main>
  );
}

function buildProductsHref(params: {
  q?: string;
  category?: string;
  page: number;
  pageSize?: number;
}) {
  const url = new URL("/products", "http://localhost");
  if (params.q) url.searchParams.set("q", params.q);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.pageSize) {
    url.searchParams.set("pageSize", String(params.pageSize));
  }
  url.searchParams.set("page", String(params.page));
  return `${url.pathname}?${url.searchParams.toString()}`;
}

