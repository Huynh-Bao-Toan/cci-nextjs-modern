import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Pagination as ShadcnPagination,
  PaginationContent as ShadcnPaginationContent,
  PaginationEllipsis as ShadcnPaginationEllipsis,
  PaginationItem as ShadcnPaginationItem,
} from "@/components/ui/pagination";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  buildHref: (page: number) => string;
};

export function Pagination({ page, pageSize, total, buildHref }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (pageCount <= 1) return null;

  const clampedPage = Math.min(Math.max(page, 1), pageCount);

  const pages = buildPageRange(clampedPage, pageCount);

  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
      <div>
        Page{" "}
        <span className="font-medium text-foreground">{clampedPage}</span> of{" "}
        <span className="font-medium text-foreground">{pageCount}</span>
      </div>
      <ShadcnPagination className="mx-0 w-auto justify-end">
        <ShadcnPaginationContent>
          <ShadcnPaginationItem>
            {clampedPage === 1 ? (
              <Button variant="ghost" size="default" disabled>
                Previous
              </Button>
            ) : (
              <Button asChild variant="ghost" size="default" className="gap-1 px-2">
                <Link href={buildHref(clampedPage - 1)}>Previous</Link>
              </Button>
            )}
          </ShadcnPaginationItem>

          {pages.map((p, index) =>
            typeof p === "number" ? (
              <ShadcnPaginationItem key={p}>
                <Button
                  asChild
                  variant={p === clampedPage ? "outline" : "ghost"}
                  size="icon"
                >
                  <Link href={buildHref(p)} aria-current={p === clampedPage ? "page" : undefined}>
                    {p}
                  </Link>
                </Button>
              </ShadcnPaginationItem>
            ) : (
              <ShadcnPaginationItem key={`ellipsis-${index}`}>
                <ShadcnPaginationEllipsis />
              </ShadcnPaginationItem>
            ),
          )}

          <ShadcnPaginationItem>
            {clampedPage === pageCount ? (
              <Button variant="ghost" size="default" disabled>
                Next
              </Button>
            ) : (
              <Button asChild variant="ghost" size="default" className="gap-1 px-2">
                <Link href={buildHref(clampedPage + 1)}>Next</Link>
              </Button>
            )}
          </ShadcnPaginationItem>
        </ShadcnPaginationContent>
      </ShadcnPagination>
    </div>
  );
}

function buildPageRange(current: number, total: number): Array<number | "..."> {
  const pages: Array<number | "..."> = [];

  for (let page = 1; page <= total; page += 1) {
    const isEdge = page === 1 || page === total;
    const isNearCurrent = Math.abs(page - current) <= 1;

    if (isEdge || isNearCurrent) {
      pages.push(page);
    } else {
      const previous = pages[pages.length - 1];
      if (previous !== "...") {
        pages.push("...");
      }
    }
  }

  return pages;
}

