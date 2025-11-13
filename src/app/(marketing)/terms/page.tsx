import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms of Service | Nepdora",
  description:
    "Read the Terms of Service for using Nepdora's website builder, e-commerce, and social media management platform. Understand your rights and responsibilities.",
  alternates: {
    canonical: "https://www.nepdora.com/terms-of-service",
  },
  keywords: [
    "Nepdora terms",
    "terms of service",
    "user agreement",
    "legal terms Nepal",
    "website builder policy",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Terms of Service | Nepdora",
    description:
      "Understand your rights and responsibilities when using the Nepdora platform. Read our official Terms of Service.",
    url: "https://www.nepdora.com/terms-of-service",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nepdora's Terms of Service",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Nepdora",
    description:
      "Read the Terms of Service for using Nepdora's website builder, e-commerce, and social media management platform.",
    images: ["https://www.nepdora.com/nepdora-image.jpg"],
  },
};
export default function TermsOfServicePage() {
  const lastUpdated = "October 29, 2025";

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="border-border bg-muted/30 mb-8 rounded-lg border p-6">
          <p className="text-foreground leading-relaxed">
            Welcome to Nepdora. These Terms of Service (&quot;Terms&quot;,
            &quot;Terms of Service&quot;) govern your use of our website located
            at https://nepdora.com (together or individually
            &quot;Service&quot;) operated by Nepdora.
          </p>
          <p className="text-foreground mt-4 leading-relaxed">
            Please read these Terms of Service carefully before using our
            Service. Your access to and use of the Service is conditioned on
            your acceptance of and compliance with these Terms.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              By accessing and using this Service, you accept and agree to be
              bound by the terms and provision of this agreement. If you do not
              agree to abide by the above, please do not use this Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These Terms apply to all visitors, users, and others who access or
              use the Service. By accessing or using the Service you agree to be
              bound by these Terms. If you disagree with any part of the terms,
              then you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              2. Use License
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Nepdora&apos;s website for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose, or for any public
                display (commercial or non-commercial)
              </li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on Nepdora&apos;s website
              </li>
              <li>
                Remove any copyright or other proprietary notations from the
                materials
              </li>
              <li>
                Transfer the materials to another person or &quot;mirror&quot;
                the materials on any other server
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              This license shall automatically terminate if you violate any of
              these restrictions and may be terminated by Nepdora at any time.
              Upon terminating your viewing of these materials or upon the
              termination of this license, you must destroy any downloaded
              materials in your possession whether in electronic or printed
              format.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              3. User Accounts
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              When you create an account with us, you must provide us
              information that is accurate, complete, and current at all times.
              Failure to do so constitutes a breach of the Terms, which may
              result in immediate termination of your account on our Service.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You are responsible for safeguarding the password that you use to
              access the Service and for any activities or actions under your
              password, whether your password is with our Service or a
              third-party service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to disclose your password to any third party. You
              must notify us immediately upon becoming aware of any breach of
              security or unauthorized use of your account. You may not use as a
              username the name of another person or entity or that is not
              lawfully available for use, a name or trademark that is subject to
              any rights of another person or entity other than you without
              appropriate authorization, or a name that is otherwise offensive,
              vulgar or obscene.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              4. Acceptable Use Policy
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You agree to use the Service only for lawful purposes and in
              accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>
                In any way that violates any applicable national or
                international law or regulation
              </li>
              <li>
                For the purpose of exploiting, harming, or attempting to exploit
                or harm minors in any way
              </li>
              <li>
                To transmit, or procure the sending of, any advertising or
                promotional material without our prior written consent
              </li>
              <li>
                To impersonate or attempt to impersonate the Company, a Company
                employee, another user, or any other person or entity
              </li>
              <li>
                In any way that infringes upon the rights of others, or in any
                way is illegal, threatening, fraudulent, or harmful
              </li>
              <li>
                To engage in any other conduct that restricts or inhibits
                anyone&apos;s use or enjoyment of the Service
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Additionally, you agree not to engage in any conduct that could
              disable, overburden, damage, or impair the Service or interfere
              with any other party&apos;s use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              5. Intellectual Property Rights
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              The Service and its original content (excluding Content provided
              by users), features and functionality are and will remain the
              exclusive property of Nepdora and its licensors. The Service is
              protected by copyright, trademark, and other laws of both Nepal
              and foreign countries.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our trademarks and trade dress may not be used in connection with
              any product or service without the prior written consent of
              Nepdora. Nothing in these Terms constitutes a transfer of any
              Intellectual Property rights from us to you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You are permitted to use the Service only as authorized by us. As
              a user, you are granted a limited, non-exclusive, revocable,
              non-transferable right to use the Service to create, display, use,
              play, and download Content subject to these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              6. User Content
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our Service may allow you to post, link, store, share and
              otherwise make available certain information, text, graphics,
              videos, or other material (&quot;Content&quot;). You are
              responsible for the Content that you post to the Service,
              including its legality, reliability, and appropriateness.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              By posting Content to the Service, you grant us the right and
              license to use, modify, publicly perform, publicly display,
              reproduce, and distribute such Content on and through the Service.
              You retain any and all of your rights to any Content you submit,
              post or display on or through the Service and you are responsible
              for protecting those rights.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You represent and warrant that: (i) the Content is yours (you own
              it) or you have the right to use it and grant us the rights and
              license as provided in these Terms, and (ii) the posting of your
              Content on or through the Service does not violate the privacy
              rights, publicity rights, copyrights, contract rights or any other
              rights of any person.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate the account of anyone found to
              be infringing on a copyright or other intellectual property
              rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              7. Purchases and Payment
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you wish to purchase any product or service made available
              through the Service (&quot;Purchase&quot;), you may be asked to
              supply certain information relevant to your Purchase including,
              without limitation, your credit card number, the expiration date
              of your credit card, your billing address, and your shipping
              information.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You represent and warrant that: (i) you have the legal right to
              use any card(s) or other payment method(s) in connection with any
              Purchase; and that (ii) the information you supply to us is true,
              correct and complete.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We may employ the use of third-party services for the purpose of
              facilitating payment and the completion of Purchases. By
              submitting your information, you grant us the right to provide the
              information to these third parties subject to our Privacy Policy.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to refuse or cancel your order at any time
              for certain reasons including but not limited to: product or
              service availability, errors in the description or price of the
              product or service, error in your order or other reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              8. Refunds and Cancellations
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We issue refunds for purchases within 30 days of the original
              purchase of the product. Refund requests must be submitted through
              our support channels and will be reviewed on a case-by-case basis.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              For subscription services, you may cancel your subscription at any
              time through your account settings. Cancellations will take effect
              at the end of your current billing period, and you will retain
              access to the Service until that time.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              No refunds will be provided for partial months or years of
              service. All fees are non-refundable except as expressly stated in
              these Terms or as required by applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              9. Third-Party Links and Services
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our Service may contain links to third-party web sites or services
              that are not owned or controlled by Nepdora. Nepdora has no
              control over, and assumes no responsibility for, the content,
              privacy policies, or practices of any third-party web sites or
              services.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You further acknowledge and agree that Nepdora shall not be
              responsible or liable, directly or indirectly, for any damage or
              loss caused or alleged to be caused by or in connection with use
              of or reliance on any such content, goods or services available on
              or through any such web sites or services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We strongly advise you to read the terms and conditions and
              privacy policies of any third-party web sites or services that you
              visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              10. Termination
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms. Upon termination, your
              right to use the Service will immediately cease.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you wish to terminate your account, you may simply discontinue
              using the Service or contact us to request account deletion. All
              provisions of the Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              11. Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              The Service is provided on an &quot;AS IS&quot; and &quot;AS
              AVAILABLE&quot; basis. The Service is provided without warranties
              of any kind, whether express or implied, including, but not
              limited to, implied warranties of merchantability, fitness for a
              particular purpose, non-infringement or course of performance.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Nepdora, its subsidiaries, affiliates, and its licensors do not
              warrant that: (a) the Service will function uninterrupted, secure
              or available at any particular time or location; (b) any errors or
              defects will be corrected; (c) the Service is free of viruses or
              other harmful components; or (d) the results of using the Service
              will meet your requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              12. Limitation of Liability
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              In no event shall Nepdora, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>
                Your access to or use of or inability to access or use the
                Service
              </li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>
                Unauthorized access, use or alteration of your transmissions or
                content
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Whether based on warranty, contract, tort (including negligence)
              or any other legal theory, whether or not we have been informed of
              the possibility of such damage, and even if a remedy set forth
              herein is found to have failed of its essential purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              13. Indemnification
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to defend, indemnify and hold harmless Nepdora and its
              licensee and licensors, and their employees, contractors, agents,
              officers and directors, from and against any and all claims,
              damages, obligations, losses, liabilities, costs or debt, and
              expenses (including but not limited to attorney&apos;s fees),
              resulting from or arising out of: (a) your use and access of the
              Service, by you or any person using your account and password; (b)
              a breach of these Terms, or (c) Content posted on the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              14. Governing Law
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              These Terms shall be governed and construed in accordance with the
              laws of Nepal, without regard to its conflict of law provisions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              15. Dispute Resolution
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you have any concern or dispute about the Service, you agree to
              first try to resolve the dispute informally by contacting us. We
              will attempt to resolve disputes through good faith negotiations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If we are unable to resolve a dispute within 30 days of receipt of
              your complaint, either party may initiate binding arbitration or
              bring an action in the courts of Nepal, and you consent to the
              exclusive jurisdiction and venue of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              16. Changes to Terms
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will try to
              provide at least 30 days&apos; notice prior to any new terms
              taking effect.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              What constitutes a material change will be determined at our sole
              discretion. By continuing to access or use our Service after those
              revisions become effective, you agree to be bound by the revised
              terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you do not agree to the new terms, please stop using the
              Service. Your continued use of the Service after the effective
              date of the revised Terms constitutes your acceptance of the
              terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              17. Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Please refer to our Privacy Policy for information on how we
              collect, use and disclose information from our users. Our Privacy
              Policy is incorporated into these Terms by reference. By using the
              Service, you consent to our collection and use of personal data as
              outlined therein. You can view our Privacy Policy at{" "}
              <a
                href="/privacy-policy"
                className="text-primary font-semibold hover:underline"
              >
                https://nepdora.com/privacy-policy
              </a>
              .
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              18. Severability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or
              invalid under any applicable law, such unenforceability or
              invalidity shall not render these Terms unenforceable or invalid
              as a whole, and such provisions shall be deleted without affecting
              the remaining provisions herein.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              19. Entire Agreement
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms, together with the Privacy Policy and any other legal
              notices published by us on the Service, shall constitute the
              entire agreement between you and Nepdora concerning the Service.
              If any provision of these Terms is deemed invalid by a court of
              competent jurisdiction, the invalidity of such provision shall not
              affect the validity of the remaining provisions of these Terms,
              which shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              20. Contact Information
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="border-border bg-muted/30 rounded-lg border p-6">
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Email:</strong>{" "}
                legal@nepdora.com
              </p>
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Support Email:</strong>{" "}
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
              21. Acknowledgment
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By using the Service or other services provided by us, you
              acknowledge that you have read these Terms of Service and agree to
              be bound by them. If you do not agree to these Terms, you are not
              authorized to use the Service.
            </p>
          </section>
        </div>

        {/* Acceptance Notice */}
        <div className="border-primary/50 bg-primary/5 mt-12 rounded-lg border p-8 text-center">
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Agreement to Terms
          </h2>
          <p className="text-muted-foreground mb-6">
            By accessing and using Nepdora, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/privacy-policy"
              className="border-border bg-background text-foreground hover:bg-muted inline-block rounded-lg border px-8 py-3 font-semibold transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/data-delete"
              className="border-border bg-background text-foreground hover:bg-muted inline-block rounded-lg border px-8 py-3 font-semibold transition-colors"
            >
              Data Deletion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
