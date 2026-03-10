import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbLink as ShadcnBreadcrumbLink,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items.length) return null;

  return (
    <ShadcnBreadcrumb className={cn("text-xs", className)}>
      <ShadcnBreadcrumbList className="text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <ShadcnBreadcrumbItem key={`${item.label}-${index}`}>
              {index > 0 ? <ShadcnBreadcrumbSeparator /> : null}
              {item.href && !isLast ? (
                <ShadcnBreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </ShadcnBreadcrumbLink>
              ) : (
                <ShadcnBreadcrumbPage>{item.label}</ShadcnBreadcrumbPage>
              )}
            </ShadcnBreadcrumbItem>
          );
        })}
      </ShadcnBreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

