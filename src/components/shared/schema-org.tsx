import { JsonLd } from "./json-ld";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const OrganizationSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    sameAs: [
      "https://www.facebook.com/NepdoraWebBuilder",
      "https://www.instagram.com/nep_dora/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977 9866316114",
      contactType: "customer service",
      areaServed: "NP",
      availableLanguage: ["en", "ne"],
    },
  };

  return <JsonLd id="organization-schema" data={data} />;
};

export const SoftwareApplicationSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    operatingSystem: "Windows, MacOS, Linux, Android, iOS",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "150",
    },
  };

  return <JsonLd id="software-schema" data={data} />;
};

export const LocalBusinessSchema = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    image: DEFAULT_OG_IMAGE,
    "@id": `${SITE_URL}/#localbusiness`,
    url: SITE_URL,
    telephone: "+977 9866316114",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sankhamul",
      addressLocality: "Lalitpur",
      postalCode: "44700",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.6841,
      longitude: 85.3344,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
  };

  return <JsonLd id="local-business-schema" data={data} />;
};

export const SchemaOrg = () => {
  return (
    <>
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <LocalBusinessSchema />
    </>
  );
};
