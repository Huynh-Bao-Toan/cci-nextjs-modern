import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";

import { ProductGrid } from "@/features/products/presentation/components/product-grid";
import { FavoriteToggle } from "@/features/products/presentation/components/favorite-toggle";
import { ProductListToolbar } from "@/features/products/presentation/components/product-list-toolbar";
import {
  getCategories,
  searchProducts,
} from "@/features/products/adapters/products.container";
import { parseProductSearchParams } from "@/features/products/presentation/lib/product.params";
import { buildProductsHref } from "@/features/products/presentation/lib/product-urls";

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const parsedParams = parseProductSearchParams(resolvedSearchParams);
  const [categories, pageData] = await Promise.all([
    getCategories(),
    searchProducts(parsedParams),
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
