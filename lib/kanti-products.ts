import kantiProducts from "@/data/kanti-products.json";

export type KantiCategory =
  | "crafts"
  | "merch"
  | "digital"
  | "art"
  | "other";

export type KantiProduct = {
  id: string;
  title: string;
  shortDescription: string;
  category: KantiCategory;
  image: string;
  flutterwaveUrl: string;
};

const products = kantiProducts as KantiProduct[];

export const kantiCategories: { id: KantiCategory | "all"; label: string }[] =
  [
    { id: "all", label: "All" },
    { id: "crafts", label: "Crafts" },
    { id: "merch", label: "Merch" },
    { id: "digital", label: "Digital" },
    { id: "art", label: "Art" },
    { id: "other", label: "Other" },
  ];

export function getKantiProducts(category?: string | string[]): KantiProduct[] {
  const raw = Array.isArray(category) ? category[0] : category;
  if (!raw || raw === "all") return products;
  const isCategory = kantiCategories.some((c) => c.id === raw && c.id !== "all");
  if (!isCategory) return products;
  return products.filter((p) => p.category === raw);
}
