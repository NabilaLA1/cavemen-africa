import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getKantiProducts,
  kantiCategories,
  type KantiCategory,
} from "@/lib/kanti-products";
import { siteConfig } from "@/lib/site-config";

const pageDescription =
  "Kanti is Cavemen Africa’s online marketplace for crafts, merch, digital products, art, and more—checkout via Flutterwave.";

export const metadata: Metadata = {
  title: "Kanti marketplace",
  description: pageDescription,
  openGraph: {
    title: `Kanti · ${siteConfig.name}`,
    description: pageDescription,
    url: "/kanti",
  },
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

function categoryHref(id: string) {
  if (id === "all") return "/kanti";
  return `/kanti?category=${encodeURIComponent(id)}`;
}

export default async function KantiPage({ searchParams }: Props) {
  const params = await searchParams;
  const known = new Set(
    kantiCategories
      .filter((c) => c.id !== "all")
      .map((c) => c.id as KantiCategory),
  );
  const requested = params.category;
  const active =
    requested && known.has(requested as KantiCategory)
      ? (requested as KantiCategory)
      : "all";
  const products = getKantiProducts(active === "all" ? undefined : active);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Kanti marketplace",
    description: pageDescription,
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: p.title,
        description: p.shortDescription,
        image: p.image,
        offers: {
          "@type": "Offer",
          url: p.flutterwaveUrl,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <main id="main-content" className="flex-1">
        <section className="border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-sand)]/35 to-[var(--color-cream)]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-dark)]">
              Marketplace
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Kanti
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Browse crafts, merch, digital releases, and art from the Cavemen
              Africa circle. Each piece links out to a Flutterwave payment page
              managed by the collective—swap in your live links in{" "}
              <code className="rounded bg-[var(--color-sand)] px-1.5 py-0.5 text-sm">
                data/kanti-products.json
              </code>
              .
            </p>
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
          aria-label="Product categories"
        >
          <div className="flex flex-wrap gap-2">
            {kantiCategories.map((cat) => {
              const isActive = active === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={categoryHref(cat.id)}
                  scroll={false}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-terracotta)] ${
                    isActive
                      ? "bg-[var(--color-forest)] text-[var(--color-cream)]"
                      : "border border-[var(--color-border)] bg-white/70 text-[var(--color-ink)] hover:border-[var(--color-forest)]"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-border)] bg-white/50 p-8 text-center text-[var(--color-ink-muted)]">
              Nothing in this category yet. Try another filter or add products to
              the JSON file.
            </p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/80 shadow-sm">
                    <div className="relative aspect-[4/3] w-full bg-[var(--color-sand)]">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-terracotta-dark)]">
                        {product.category}
                      </p>
                      <h2 className="mt-2 font-serif text-xl font-semibold text-[var(--color-ink)]">
                        {product.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                        {product.shortDescription}
                      </p>
                      <a
                        href={product.flutterwaveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--color-terracotta)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-terracotta-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-forest)]"
                      >
                        Buy with Flutterwave
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
