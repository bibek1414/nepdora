import TemplatesPage from "@/components/marketing/templates/templates-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepdora Templates | Ready-to-Use Designs for Your Projects",
  description:
    "Explore Nepdora’s collection of professionally designed templates. Quickly create websites, landing pages, and digital projects with ease and style.",
};

export default function Templates() {
  return <TemplatesPage />;
}
