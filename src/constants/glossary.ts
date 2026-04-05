export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  detailedExplanation: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "Shared Hosting",
    slug: "what-is-shared-hosting",
    definition:
      "A type of web hosting where multiple websites reside on one web server connected to the Internet.",
    detailedExplanation:
      "Shared hosting is the most cost-effective way to get a website online in Nepal. It involves sharing server resources with other users, making it ideal for small businesses and personal blogs. However, for high-traffic sites, dedicated or VPS hosting might be better.",
  },
  {
    term: "SSL Certificate",
    slug: "what-is-ssl-certificate",
    definition:
      "A digital certificate that provides authentication for a website and enables an encrypted connection.",
    detailedExplanation:
      "SSL is critical for any website in Nepal that handles sensitive data, including e-commerce stores accepting payments. It turns HTTP into HTTPS and shows a padlock icon in the browser, building trust with your local customers.",
  },
  {
    term: "Domain Name",
    slug: "what-is-a-domain-name",
    definition:
      "The address of your website that people type in the browser URL bar to visit.",
    detailedExplanation:
      "Your domain name is your digital identity in Nepal. Common choices include .com, .com.np, and .net. Choosing a short, memorable name is key for local brand recognition.",
  },
  {
    term: "Payment Gateway",
    slug: "what-is-a-payment-gateway",
    definition:
      "A technology used by merchants to accept debit or credit card purchases from customers.",
    detailedExplanation:
      "In the context of Nepal, payment gateways like eSewa, Khalti, and Fonepay are essential for processing local digital payments securely on your website.",
  },
];
