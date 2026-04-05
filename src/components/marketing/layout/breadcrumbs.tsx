import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
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
    <nav className="scrollbar-hide flex items-center gap-2 overflow-x-auto py-4 text-sm font-medium whitespace-nowrap text-slate-500">
      <JsonLd id="breadcrumb-schema" data={schema} />

      {allItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index === 0 ? (
            <Link
              href={item.href}
              className="hover:text-primary flex items-center gap-1 transition-colors hover:scale-105 active:scale-95"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <Link
              href={item.href}
              className={`hover:text-primary transition-colors hover:scale-105 active:scale-95 ${
                index === allItems.length - 1 ? "font-bold text-slate-900" : ""
              }`}
            >
              {item.label}
            </Link>
          )}

          {index < allItems.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
          )}
        </div>
      ))}
    </nav>
  );
}
