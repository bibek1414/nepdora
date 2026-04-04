import { InvoiceBuilder } from "@/components/marketing/tools/invoice-builder";
import { Metadata } from "next";
import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMarketingMetadata({
    title: "Professional Invoice Builder for Nepal | Free & Instant | Nepdora",
    description: "Create and download professional invoices for your business in Nepal instantly. Free invoice templates for freelancers, agencies, and small businesses.",
    path: "/invoice-builder",
  });
}

export default function InvoiceBuilderPage() {
  return <InvoiceBuilder />;
}
