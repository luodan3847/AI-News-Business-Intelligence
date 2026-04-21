import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import { getRepositoryUrl, getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();
const repositoryUrl = getRepositoryUrl();

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  description: siteConfig.description,
  keywords: [
    "AI news",
    "business intelligence",
    "AI use cases",
    "business impact",
    "predictions",
    "Supabase",
    "Drizzle",
    "Next.js",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.ogDescription,
    type: "website",
    siteName: siteConfig.name,
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.ogDescription,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f5efe4_0%,#f7f3eb_34%,#ece6da_66%,#e3dbce_100%)] text-stone-900">
          <SiteHeader />
          <main>{children}</main>
          <footer className="border-t border-stone-300/80 bg-[rgba(255,253,248,0.82)]">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-stone-600 md:px-10 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="font-medium text-stone-900">
                  {siteConfig.name}
                </p>
                <p className="mt-2 leading-7">
                  {siteConfig.footerDescription}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/methodology" className="transition hover:text-stone-950">
                  Methodology
                </Link>
                <Link href="/predictions" className="transition hover:text-stone-950">
                  Predictions
                </Link>
                {repositoryUrl ? (
                  <a
                    href={repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-stone-950"
                  >
                    Repository
                  </a>
                ) : null}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
