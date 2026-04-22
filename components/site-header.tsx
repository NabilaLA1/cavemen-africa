import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:bg-[var(--color-sand)] hover:text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link href="/asali-open-mic" className={navLinkClass}>
            Asali Open Mic
          </Link>
          <Link href="/kanti" className={navLinkClass}>
            Kanti
          </Link>
        </nav>
      </div>
    </header>
  );
}
