import Script from "next/script";

interface JsonLdProps {
  id: string;
  data: Record<string, any>;
}

export const JsonLd = ({ id, data }: JsonLdProps) => {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};
