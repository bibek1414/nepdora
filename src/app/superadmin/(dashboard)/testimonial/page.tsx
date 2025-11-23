import TestimonialList from "@/components/super-admin/testimonials/testimonial-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Testimonials Management",
    pageDescription:
      "Manage customer testimonials for {storeName}. Add, edit, and organize testimonials to build trust and showcase positive feedback on your site.",
    pageRoute: "/admin/testimonials",
  });
}

export default function TestimonialsManagementPage() {
  return <TestimonialList />;
}
