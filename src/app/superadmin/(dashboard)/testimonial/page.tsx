import TestimonialList from "@/components/super-admin/testimonials/testimonial-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials Management | Nepdora Superadmin",
  description: "Manage customer testimonials for the platform.",
};

export default function TestimonialsManagementPage() {
  return <TestimonialList />;
}
