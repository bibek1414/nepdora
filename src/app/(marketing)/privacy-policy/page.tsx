import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nepdora",
  description:
    "Learn how Nepdora collects, uses, and protects your personal data. Our privacy policy covers account information, Facebook Login, and your data rights.",
  alternates: {
    canonical: "https://www.nepdora.com/privacy-policy",
  },
  keywords: [
    "Nepdora privacy policy",
    "data protection Nepal",
    "user privacy",
    "Facebook login privacy",
    "personal data",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Privacy Policy | Nepdora",
    description:
      "Learn how Nepdora collects, uses, and protects your personal data. Our policy covers account information, Facebook Login, and your data rights.",
    url: "https://www.nepdora.com/privacy-policy",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/images/nepdora-image.png",
        width: 1200,
        height: 630,
        alt: "Nepdora's Privacy Policy",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Nepdora",
    description:
      "Learn how Nepdora collects, uses, and protects your personal data, including information from Facebook Login.",
    images: ["https://www.nepdora.com/images/nepdora-image.png"],
  },
};
export default function PrivacyPolicyPage() {
  const lastUpdated = "October 29, 2025";

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              1. Introduction
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Welcome to Nepdora (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). We are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website and use our services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using our services, you agree to the terms
              outlined in this Privacy Policy. If you do not agree with our
              practices, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              2. Information We Collect
            </h2>
            <h3 className="text-foreground mb-3 text-xl font-semibold">
              2.1 Personal Information
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We may collect personal information that you voluntarily provide
              to us when you:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>Register for an account</li>
              <li>Make a purchase or transaction</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us through our support channels</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              This information may include your name, email address, phone
              number, billing address, shipping address, and payment
              information.
            </p>

            <h3 className="text-foreground mb-3 text-xl font-semibold">
              2.2 Automatically Collected Information
            </h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              When you visit our website, we automatically collect certain
              information about your device and browsing behavior, including:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              3. How We Use Your Information
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>Providing, operating, and maintaining our services</li>
              <li>Processing transactions and sending related information</li>
              <li>
                Sending administrative information, updates, and security alerts
              </li>
              <li>
                Responding to your comments, questions, and customer service
                requests
              </li>
              <li>Improving and personalizing your experience</li>
              <li>Analyzing usage trends and preferences</li>
              <li>
                Detecting, preventing, and addressing technical issues or fraud
              </li>
              <li>
                Sending marketing and promotional communications (with your
                consent)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              4. Facebook Login Integration
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our website uses Facebook Login to provide you with a convenient
              authentication option. When you choose to log in with Facebook, we
              may collect:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>Your public profile information (name, profile picture)</li>
              <li>Email address associated with your Facebook account</li>
              <li>
                Other information you explicitly grant us permission to access
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We only request the minimum permissions necessary to provide our
              services. You can manage these permissions through your Facebook
              account settings at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              5. Information Sharing and Disclosure
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We do not sell, trade, or rent your personal information to third
              parties. We may share your information in the following
              circumstances:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>
                With service providers who assist us in operating our website
                and services
              </li>
              <li>
                To comply with legal obligations, court orders, or government
                requests
              </li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>
                In connection with a business transfer, merger, or acquisition
              </li>
              <li>With your explicit consent for specific purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              6. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the internet or electronic storage is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We use cookies and similar tracking technologies to track activity
              on our website and store certain information. You can instruct
              your browser to refuse all cookies or indicate when a cookie is
              being sent. However, if you do not accept cookies, you may not be
              able to use some portions of our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              8. Your Data Protection Rights
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Depending on your location, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>Access: Request copies of your personal information</li>
              <li>
                Rectification: Request correction of inaccurate information
              </li>
              <li>Erasure: Request deletion of your personal information</li>
              <li>
                Restriction: Request restriction of processing your information
              </li>
              <li>
                Objection: Object to our processing of your personal information
              </li>
              <li>
                Data portability: Request transfer of your information to
                another organization
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              9. Third-Party Links
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website may contain links to third-party websites that are not
              operated by us. We have no control over and assume no
              responsibility for the content, privacy policies, or practices of
              any third-party sites or services. We encourage you to review the
              privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              10. Children&quot;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If you are a parent or guardian and believe that your child
              has provided us with personal information, please contact us so we
              can delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              11. International Data Transfers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and maintained on computers
              located outside of your state, province, country, or other
              governmental jurisdiction where data protection laws may differ.
              By using our services, you consent to such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date. You are
              advised to review this Privacy Policy periodically for any
              changes. Changes are effective when posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              13. Contact Us
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <div className="border-border bg-muted/30 rounded-lg border p-6">
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Email:</strong>{" "}
                support@nepdora.com
              </p>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Website:</strong>{" "}
                https://nepdora.com
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Address:</strong> Kathmandu,
                Nepal
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              14. Consent
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By using our website and services, you hereby consent to our
              Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
