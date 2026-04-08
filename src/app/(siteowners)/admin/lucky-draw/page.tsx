import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import LuckyDrawClient from "./lucky-draw-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Lucky Draw",
    pageDescription:
      "Manage lucky draw campaigns for {storeName}. Create new draws, monitor participants, and select winners to engage your audience.",
    pageRoute: "/admin/lucky-draw",
  });
}

export default function LuckyDrawPage() {
  return <LuckyDrawClient />;
}
