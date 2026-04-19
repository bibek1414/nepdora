import VideoTestimonialList from "@/components/super-admin/video-testimonials/video-testimonial-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Testimonials | Nepdora Superadmin",
  description: "Manage and organize platform-wide video testimonials.",
};

export default function VideoTestimonialsManagementPage() {
  return <VideoTestimonialList />;
}
