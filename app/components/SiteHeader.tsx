import Link from "next/link";
import { getRepositoryUrl, siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/news", label: "News" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/tools", label: "Tools" },
  { href: "/predictions", label: "Predictions" },
  { href: "/methodology", label: "Methodology" },
];
const repositoryUrl = getRepositoryUrl();

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-300/80 bg-[rgba(244,239,231,0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link href="/" className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            {siteConfig.name}
          </div>
          <div className="mt-1 truncate font-serif text-xl tracking-tight text-stone-950">
            {siteConfig.tagline}
          </div>
        </Link>

        <nav className="hidden flex-wrap items-center gap-5 text-sm font-medium text-stone-600 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
          {repositoryUrl ? (
            <a
              href={repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-stone-300 px-4 py-2 text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              Repository
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
