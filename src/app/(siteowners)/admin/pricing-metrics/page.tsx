import { MetricList } from "@/components/site-owners/admin/pricing-metrics/metric-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Pricing Metric Management",
    pageDescription:
      "Manage dynamic pricing metrics for {storeName}. Define rates for materials like gold, silver, or stones to calculate product prices dynamically.",
    pageRoute: "/admin/pricing-metrics",
  });
}

export default function PricingMetricManagementPage() {
  return (
    <div className="mx-auto p-5 py-10">
      <MetricList />
    </div>
  );
}
