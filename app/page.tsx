import type { Metadata } from "next";
import Link from "next/link";
import {
  aboutParagraphs,
  heroEyebrow,
  heroIntro,
  heroTitle,
  impactStats,
  partners,
  previousProjects,
  testimonials,
  upcomingEvents,
} from "@/lib/home-content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.contactEmail,
  telephone: siteConfig.phoneTel,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.addressLines[0],
    addressLocality: "Kano",
    addressCountry: "NG",
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.x,
    siteConfig.social.instagram,
    siteConfig.social.youtube,
    siteConfig.social.tiktok,
    siteConfig.social.whatsapp,
  ],
};

const sectionTitleClass =
  "font-serif text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl";

function EventCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const external = href.startsWith("http");
  const className =
    "inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--color-forest)] px-5 py-2.5 text-sm font-semibold text-[var(--color-forest)] transition hover:bg-[var(--color-forest)] hover:text-[var(--color-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]";
  if (external) {
    return (
      <a
        href={href}
        className={className}
        rel="noopener noreferrer"
        target="_blank"
      >
        {label}
      </a>
    );
  }
  return <Link href={href} className={className}>{label}</Link>;
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-sand)]/40 to-[var(--color-cream)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-dark)]">
              {heroEyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {heroIntro}
            </p>
            <p className="mt-4 text-sm text-[var(--color-ink-muted)]">
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="font-semibold text-[var(--color-terracotta-dark)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
              >
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/asali"
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-terracotta)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-terracotta-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
              >
                Asali Poetry Sessions
              </Link>
              <Link
                href="/kanti"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-forest)] bg-transparent px-6 py-3 text-sm font-semibold text-[var(--color-forest)] transition hover:bg-[var(--color-forest)] hover:text-[var(--color-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
              >
                Shop Kanti
              </Link>
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" className={sectionTitleClass}>
            About us
          </h2>
          <div className="mt-8 max-w-3xl space-y-4 text-[var(--color-ink-muted)] leading-relaxed">
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/asali"
              className="inline-flex text-sm font-semibold text-[var(--color-terracotta-dark)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
            >
              Asali Poetry Sessions
            </Link>
            <span className="text-[var(--color-border)]" aria-hidden>
              ·
            </span>
            <Link
              href="/kanti"
              className="inline-flex text-sm font-semibold text-[var(--color-terracotta-dark)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
            >
              Kanti marketplace
            </Link>
          </div>
        </section>

        <section
          className="border-t border-[var(--color-border)] bg-[var(--color-sand)]/25"
          aria-labelledby="partners-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 id="partners-heading" className={sectionTitleClass}>
              Our partners
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
              Consortium members and strategic allies named on the former
              Cavemen Africa site.
            </p>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((partner) => (
                <li key={partner.name}>
                  <article className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-white/70 p-6 text-left shadow-sm">
                    <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                      {partner.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {partner.summary}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
          aria-labelledby="projects-heading"
        >
          <h2 id="projects-heading" className={sectionTitleClass}>
            Our previous projects
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
            Programmes and service lines highlighted on the previous website.
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {previousProjects.map((project) => (
              <li key={project.title}>
                <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white/60 p-6 shadow-sm backdrop-blur">
                  {project.year ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-terracotta-dark)]">
                      {project.year}
                    </p>
                  ) : null}
                  <h3 className="mt-2 font-serif text-lg font-semibold text-[var(--color-ink)]">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {project.summary}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="border-t border-[var(--color-border)] bg-[var(--color-sand)]/20"
          aria-labelledby="testimonials-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 id="testimonials-heading" className={sectionTitleClass}>
              Successful projects &amp; satisfied clients
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
              Testimonials carried over from the WordPress homepage—review and
              remove any template placeholders you no longer use.
            </p>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.cite}>
                  <blockquote className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white/70 p-6 shadow-sm">
                    <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {t.quote}
                    </p>
                    <footer className="mt-4 text-sm font-semibold text-[var(--color-ink)]">
                      — {t.cite}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="border-t border-[var(--color-border)] bg-[var(--color-cream)]"
          aria-labelledby="events-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 id="events-heading" className={sectionTitleClass}>
              Upcoming events
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
              Creative events from the former site—confirm dates and links before
              each season.
            </p>
            <ul className="mt-10 space-y-4">
              {upcomingEvents.map((event) => (
                <li key={event.title}>
                  <article className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-white/80 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-[var(--color-terracotta-dark)]">
                        {event.dateLabel}
                      </p>
                      <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
                        {event.description}
                      </p>
                    </div>
                    {event.href ? (
                      <EventCta
                        href={event.href}
                        label={event.ctaLabel ?? "Learn more"}
                      />
                    ) : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="border-t border-[var(--color-border)] bg-[var(--color-forest)] text-[var(--color-cream)]"
          aria-labelledby="impact-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 id="impact-heading" className={`${sectionTitleClass} text-[var(--color-cream)]`}>
              Impact numbers so far
            </h2>
            <p className="mt-3 max-w-2xl text-[var(--color-cream)]/80">
              Figures aligned with public programme copy; refine anytime in{" "}
              <code className="rounded bg-[var(--color-forest-soft)] px-1.5 py-0.5 text-sm text-[var(--color-cream)]">
                lib/home-content.ts
              </code>
              .
            </p>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat) => (
                <li key={stat.label} className="text-center sm:text-left">
                  <p className="font-serif text-4xl font-semibold tracking-tight text-[var(--color-cream)] sm:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-[var(--color-cream)]/85">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] bg-[var(--color-sand)]/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className={sectionTitleClass}>Stay in touch</h2>
            <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
              Inspired by our work? Reach us on the phone, by email, or visit
              the studio in Kano.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex rounded-full bg-[var(--color-forest)] px-6 py-3 text-sm font-semibold text-[var(--color-cream)] transition hover:bg-[var(--color-forest-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
              >
                Email {siteConfig.contactEmail}
              </a>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-forest)] px-6 py-3 text-sm font-semibold text-[var(--color-forest)] transition hover:bg-[var(--color-forest)] hover:text-[var(--color-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
              >
                Call {siteConfig.phoneDisplay}
              </a>
            </div>
            <p className="mt-6 max-w-xl text-sm text-[var(--color-ink-muted)]">
              {siteConfig.addressLines.join(", ")}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
