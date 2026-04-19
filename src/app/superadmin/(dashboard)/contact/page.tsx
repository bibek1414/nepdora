import ContactClient from "./contact-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Messages | Nepdora Superadmin",
  description: "Review and respond to contact inquiries from users.",
};

export default function ContactMessagesPage() {
  return <ContactClient />;
}
