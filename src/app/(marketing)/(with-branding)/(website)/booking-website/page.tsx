import { CitiesLandingPage } from "@/components/marketing/cities/cities-landing-page";
import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Create a Booking Website in Nepal (Fast Setup) | ${SITE_NAME}`,
  description: `Launch your professional booking website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from ${SITE_NAME}.`,
  keywords: [
    "booking website Nepal",
    "appointment system Nepal",
    `${SITE_NAME} booking`,
    "scheduling software Nepal",
    "online appointments Nepal",
  ],
  metadataBase: new URL(absoluteUrl()),
  alternates: {
    canonical: absoluteUrl("/booking-website"),
  },
  openGraph: {
    title: `Create a Booking Website in Nepal (Fast Setup) | ${SITE_NAME}`,
    description: `Launch your professional booking website in Nepal in under 10 minutes. Integrated payments, local support, and easy-to-use tools from ${SITE_NAME}.`,
    url: absoluteUrl("/booking-website"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Booking and Appointment System`,
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Create a Booking Website in Nepal (Fast Setup) | ${SITE_NAME}`,
    description: `Launch your professional booking website in Nepal in under 10 minutes. Build with ${SITE_NAME}.`,
    images: [DEFAULT_OG_IMAGE],
  },
};

const bookingSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${SITE_NAME} Booking Website Builder`,
  description:
    "Online booking and appointment scheduling software integrated into professional websites for Nepali businesses.",
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
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
