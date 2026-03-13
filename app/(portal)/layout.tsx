import type { ReactNode } from "react"

import { PageShell } from "@/components/shared/page-shell"

type PortalLayoutProps = {
  children: ReactNode
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  return <PageShell>{children}</PageShell>
}

