import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const socialClass =
  "text-[var(--color-cream)]/85 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-forest)] text-[var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-lg font-semibold">{siteConfig.name}</p>
            <p className="mt-1 text-sm font-medium text-[var(--color-cream)]/90">
              {siteConfig.tagline}
            </p>
            <p className="mt-2 text-sm text-[var(--color-cream)]/80">
              Owned and operated by {siteConfig.legalName}.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <p className="font-medium text-[var(--color-cream)]">Explore</p>
            <ul className="flex flex-col gap-2 text-[var(--color-cream)]/85">
              <li>
                <Link
                  href="/asali"
                  className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
                >
                  Asali Poetry Sessions
                </Link>
              </li>
              <li>
                <Link
                  href="/kanti"
                  className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
                >
                  Kanti marketplace
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <p className="font-medium text-[var(--color-cream)]">Contact</p>
            <p className="text-[var(--color-cream)]/85">
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className={socialClass}
              >
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className={`w-fit ${socialClass}`}
            >
              {siteConfig.contactEmail}
            </a>
            <p className="max-w-xs text-[var(--color-cream)]/80">
              {siteConfig.addressLines.join(", ")}
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="font-medium text-[var(--color-cream)]">Social</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a
                href={siteConfig.social.facebook}
                className={socialClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                Facebook
              </a>
              <a
                href={siteConfig.social.x}
                className={socialClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                X
              </a>
              <a
                href={siteConfig.social.instagram}
                className={socialClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
              <a
                href={siteConfig.social.whatsapp}
                className={socialClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.social.youtube}
                className={socialClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                YouTube
              </a>
              <a
                href={siteConfig.social.tiktok}
                className={socialClass}
                rel="noopener noreferrer"
                target="_blank"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-[var(--color-cream)]/60">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
