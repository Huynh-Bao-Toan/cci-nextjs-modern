import type { Metadata } from "next";
import "@/styles/globals.css";
import { geist, geistMono, geistSans } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: "Mini Commerce Catalog",
  description: "A mini e-commerce catalog powered by DummyJSON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
