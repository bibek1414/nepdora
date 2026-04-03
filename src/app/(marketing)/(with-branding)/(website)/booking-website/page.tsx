import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Create a Booking Website in Nepal (Fast Setup) | Nepdora",
  description:
    "Launch your professional booking website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from Nepdora.",
  keywords: [
    "booking website Nepal",
    "appointment system Nepal",
    "Nepdora booking",
    "scheduling software Nepal",
    "online appointments Nepal",
  ],
  alternates: {
    canonical: "https://www.nepdora.com/booking-website",
  },
  openGraph: {
    title: "Create a Booking Website in Nepal (Fast Setup) | Nepdora",
    description:
      "Launch your professional booking website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from Nepdora.",
    url: "https://www.nepdora.com/booking-website",
    siteName: "Nepdora",
    images: [
      {
        url: "/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora - Booking and Appointment System",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create a Booking Website in Nepal (Fast Setup) | Nepdora",
    description:
      "Launch your professional booking website in Nepal in under 10 minutes. Build with Nepdora.",
    images: ["/nepdora-image.jpg"],
  },
};

const bookingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Nepdora Booking Website Builder",
  description:
    "Online booking and appointment scheduling software integrated into professional websites for Nepali businesses.",
  provider: {
    "@type": "Organization",
    name: "Nepdora",
    url: "https://www.nepdora.com",
  },
  areaServed: "NP",
};

export default function Page() {
  return (
    <>
      <JsonLd id="booking-schema" data={bookingSchema} />
      <CitiesLandingPage category="booking" city="nepal" />
    </>
  );
}
