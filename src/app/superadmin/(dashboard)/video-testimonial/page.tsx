import VideoTestimonialList from "@/components/super-admin/video-testimonials/video-testimonial-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Video Testimonials Management",
    pageDescription:
      "Manage video testimonials for Nepdora. Add, edit, and organize video feedback from YouTube, Instagram, and more.",
    pageRoute: "/superadmin/video-testimonial",
  });
}

export default function VideoTestimonialsManagementPage() {
  return <VideoTestimonialList />;
}
