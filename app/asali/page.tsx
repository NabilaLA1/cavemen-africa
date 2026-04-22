import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const pageDescription =
  "Asali is where raw voices rise—a mic, a stage, and the stories we carry. Poetry sessions at Cavemen Africa in Kano.";

export const metadata: Metadata = {
  title: "Asali Poetry Sessions",
  description: pageDescription,
  openGraph: {
    title: `Asali Poetry Sessions · ${siteConfig.name}`,
    description: pageDescription,
    url: "/asali",
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Asali Poetry Sessions",
  description: pageDescription,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  organizer: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  location: {
    "@type": "Place",
    name: "Cavemen Africa",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressLines[0],
      addressLocality: "Kano",
      addressCountry: "NG",
    },
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${siteConfig.url}/asali`,
  },
};

const faqs = [
  {
    q: "Do I need to sign up in advance?",
    a: "We recommend a quick RSVP so we can plan seating and sound. Walk-ins are welcome if space allows.",
  },
  {
    q: "How long is each performance?",
    a: "Most performance slots are around five minutes. Featured sets may run longer—check the monthly post for details.",
  },
  {
    q: "Is the event only for poetry?",
    a: "Spoken word comes first, but storytelling and hybrid pieces often find a home here too—as long as they respect the room.",
  },
  {
    q: "Is there a cover charge?",
    a: "Update this line with your real ticketing or donation policy.",
  },
];

export default function AsaliPoetrySessionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <main id="main-content" className="flex-1">
        <section className="border-b border-[var(--color-border)] bg-[var(--color-cream)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-dark)]">
              Community event
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Asali Poetry Sessions
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Asali is where raw voices rise. A mic, a stage, and the stories we
              carry—open to first-timers and returning voices alike. Each season
              closes with the community that has grown the room; watch our
              channels for the next date at Cavemen Africa, Kano.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${siteConfig.contactEmail}?subject=Asali%20Poetry%20Sessions%20RSVP`}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-terracotta)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-terracotta-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
              >
                RSVP by email
              </a>
              <Link
                href="/kanti"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white/70 px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--color-forest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
              >
                Support makers on Kanti
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl font-semibold text-[var(--color-ink)]">
                About the night
              </h2>
              <p className="mt-4 text-[var(--color-ink-muted)] leading-relaxed">
                We really want to end each season with the people who have been
                part of this space from the beginning—if you have attended
                before, come back and help us close the year together.
              </p>
              <p className="mt-4 text-[var(--color-ink-muted)] leading-relaxed">
                Microphones are shared, applause is generous, and the bar for
                “good enough” is showing up. We celebrate poets working in every
                language represented in the room.
              </p>

              <h2 className="mt-12 font-serif text-2xl font-semibold text-[var(--color-ink)]">
                Format &amp; house etiquette
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-ink-muted)]">
                <li>Sign-up list opens at the door; featured readers may be pre-booked.</li>
                <li>Respect time limits so everyone gets airtime.</li>
                <li>No recording without clear consent from performers.</li>
                <li>Content warnings are welcome before heavier pieces.</li>
              </ul>
            </div>
            <aside className="rounded-2xl border border-[var(--color-border)] bg-white/70 p-6 shadow-sm">
              <h2 className="font-serif text-lg font-semibold text-[var(--color-ink)]">
                Schedule &amp; location
              </h2>
              <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
                Details are announced for each edition—confirm times before you
                travel.
              </p>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="font-semibold text-[var(--color-ink)]">
                    When
                  </dt>
                  <dd className="mt-1 text-[var(--color-ink-muted)]">
                    Seasonal sessions (e.g. Asali 6.0)—follow Cavemen Africa
                    socials for the next date and door time.
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-ink)]">
                    Where
                  </dt>
                  <dd className="mt-1 text-[var(--color-ink-muted)]">
                    Cavemen Africa — {siteConfig.addressLines.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-ink)]">
                    Accessibility
                  </dt>
                  <dd className="mt-1 text-[var(--color-ink-muted)]">
                    Add step-free access, hearing loop, and quiet room details here.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section
          className="border-t border-[var(--color-border)] bg-[var(--color-sand)]/25"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2
              id="faq-heading"
              className="font-serif text-2xl font-semibold text-[var(--color-ink)]"
            >
              Frequently asked questions
            </h2>
            <ul className="mt-8 space-y-6">
              {faqs.map((item) => (
                <li
                  key={item.q}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)]/80 p-6"
                >
                  <h3 className="font-semibold text-[var(--color-ink)]">
                    {item.q}
                  </h3>
                  <p className="mt-2 text-[var(--color-ink-muted)]">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="rounded-2xl bg-[var(--color-forest)] px-8 py-10 text-[var(--color-cream)] sm:px-12">
            <h2 className="font-serif text-2xl font-semibold">
              Bring a poem—or bring your whole crew.
            </h2>
            <p className="mt-3 max-w-xl text-[var(--color-cream)]/85">
              Questions about features, collaborations, or accessibility? Reach
              out and we&apos;ll get back as soon as we can.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="inline-flex rounded-full bg-[var(--color-cream)] px-6 py-3 text-sm font-semibold text-[var(--color-forest)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
              >
                {siteConfig.contactEmail}
              </a>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-cream)] px-6 py-3 text-sm font-semibold text-[var(--color-cream)] transition hover:bg-[var(--color-cream)] hover:text-[var(--color-forest)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)]"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
