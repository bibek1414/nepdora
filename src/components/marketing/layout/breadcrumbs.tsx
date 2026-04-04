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
  const allItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    ...items,
  ];

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
    <nav className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-4 text-sm font-medium text-slate-500 scrollbar-hide">
      <JsonLd id="breadcrumb-schema" data={schema} />
      
      {allItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index === 0 ? (
            <Link 
              href={item.href} 
              className="flex items-center gap-1 hover:text-primary transition-colors hover:scale-105 active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link 
              href={item.href} 
              className={`hover:text-primary transition-colors hover:scale-105 active:scale-95 ${
                index === allItems.length - 1 ? "text-slate-900 font-bold" : ""
              }`}
            >
              {item.label}
            </Link>
          )}
          
          {index < allItems.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          )}
        </div>
      ))}
    </nav>
  );
}
