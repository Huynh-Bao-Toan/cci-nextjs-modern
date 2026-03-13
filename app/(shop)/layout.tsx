import type { ReactNode } from "react";

import { PageShell } from "@/components/shared/page-shell";

type ShopLayoutProps = {
  children: ReactNode;
};

export default function ShopLayout({ children }: ShopLayoutProps) {
  return <PageShell>{children}</PageShell>;
}

