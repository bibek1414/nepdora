import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/seo";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always add Home to the beginning
  const allItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  // Schema.org BreadcrumbList
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href === "/" ? "" : item.href),
    })),
  };

  return (
    <nav className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-2 text-sm font-medium whitespace-nowrap">
      <JsonLd id="breadcrumb-schema" data={schema} />

      {allItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <Link
            href={item.href}
            className={`transition-colors duration-200 ${
              index === allItems.length - 1
                ? "pointer-events-none text-slate-900"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {item.label}
          </Link>

          {index < allItems.length - 1 && (
            <span className="font-light text-slate-300 transition-opacity select-none">
              /
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
