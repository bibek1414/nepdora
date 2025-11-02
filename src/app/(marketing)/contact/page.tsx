import ContactSection from "@/components/marketing/contact-us/contact-us";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with Nepdora",
  description:
    "Have questions or need support? Contact Nepdora today. Our team is here to help you with inquiries, partnerships, or customer support.",
};

export default function ContactPage() {
  return <ContactSection />;
}
