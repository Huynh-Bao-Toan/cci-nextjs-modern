import Link from "next/link";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/favorites", label: "Favorites" },
  { href: "/products-portal", label: "Portal" },
];

export function AppHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
            MC
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:inline">
            Mini Commerce Catalog
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
