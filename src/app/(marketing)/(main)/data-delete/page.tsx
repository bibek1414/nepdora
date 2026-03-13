import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | Nepdora",
  description:
    "Find out how to permanently delete your account and personal data from Nepdora, including information collected via Facebook Login. Follow our step-by-step instructions.",
  alternates: {
    canonical: "https://www.nepdora.com/data-deletion",
  },
  keywords: [
    "data deletion",
    "delete Nepdora account",
    "remove personal data",
    "Facebook data removal",
    "right to be forgotten",
  ],
  authors: [{ name: "Nepdora Team", url: "https://www.nepdora.com" }],
  metadataBase: new URL("https://www.nepdora.com"),
  openGraph: {
    title: "Data Deletion Instructions | Nepdora",
    description:
      "Find out how to permanently delete your account and personal data from Nepdora, including information collected via Facebook Login.",
    url: "https://www.nepdora.com/data-deletion",
    siteName: "Nepdora",
    images: [
      {
        url: "https://www.nepdora.com/nepdora-image.jpg",
        width: 1200,
        height: 630,
        alt: "Instructions for deleting your Nepdora data",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Deletion Instructions | Nepdora",
    description:
      "Step-by-step instructions on how to permanently delete your account and personal data from the Nepdora platform.",
    images: ["https://www.nepdora.com/nepdora-image.jpg"],
  },
};
export default function DataDeletionPage() {
  const lastUpdated = "October 29, 2025";

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl">
            Data Deletion Instructions
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="border-border bg-muted/30 mb-8 rounded-lg border p-6">
          <p className="text-foreground leading-relaxed">
            At Nepdora, we respect your privacy and your right to control your
            personal data. This page provides instructions on how to request
            deletion of your data from our platform, including data associated
            with Facebook Login.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              1. What Data We Store
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              When you use our services, we may collect and store the following
              information:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>
                Account information (name, email address, profile picture)
              </li>
              <li>Facebook profile data (if you sign in with Facebook)</li>
              <li>Usage data and preferences</li>
              <li>Transaction history (if applicable)</li>
              <li>Communication history with our support team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              2. How to Request Data Deletion
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              You can request deletion of your data through the following
              methods:
            </p>

            <div className="border-border bg-card mb-6 rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Method 1: Delete Your Account
              </h3>
              <ol className="text-muted-foreground ml-6 list-decimal space-y-2">
                <li>Log in to your Nepdora account</li>
                <li>Go to Settings → Account Settings</li>
                <li>Scroll down to the &quot;Delete Account&quot; section</li>
                <li>Click &quot;Delete My Account&quot;</li>
                <li>
                  Confirm your decision by following the on-screen prompts
                </li>
              </ol>
            </div>

            <div className="border-border bg-card mb-6 rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Method 2: Email Request
              </h3>
              <p className="text-muted-foreground mb-3">
                Send an email to our data protection team with your deletion
                request:
              </p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground mb-2">
                  <strong>Email:</strong> privacy@nepdora.com
                </p>
                <p className="text-foreground mb-2">
                  <strong>Subject:</strong> Data Deletion Request
                </p>
                <p className="text-muted-foreground">
                  <strong>Include:</strong> Your full name, email address, and
                  account username (if applicable)
                </p>
              </div>
            </div>

            <div className="border-border bg-card rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Method 3: Contact Form
              </h3>
              <p className="text-muted-foreground mb-3">
                Fill out our data deletion request form:
              </p>
              <a
                href="https://nepdora.com/contact"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-6 py-3 font-semibold transition-colors"
              >
                Submit Deletion Request
              </a>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              3. Facebook Login Data Deletion
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you signed up using Facebook Login, you have additional
              options:
            </p>

            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
              <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
                Option A: Remove App from Facebook
              </h3>
              <ol className="ml-6 list-decimal space-y-2 text-blue-800 dark:text-blue-200">
                <li>Go to your Facebook Settings</li>
                <li>Click on &quot;Apps and Websites&quot;</li>
                <li>Find &quot;Nepdora&quot; in the list</li>
                <li>Click &quot;Remove&quot;</li>
                <li>Confirm the removal</li>
              </ol>
              <p className="mt-4 text-sm text-blue-700 dark:text-blue-300">
                Note: This will revoke Nepdora&apos;s access to your Facebook
                data, but you must also delete your Nepdora account separately
                to remove data from our servers.
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
              <h3 className="mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100">
                Option B: Complete Data Deletion
              </h3>
              <p className="mb-3 text-blue-800 dark:text-blue-200">
                For complete deletion of all data associated with your Facebook
                account:
              </p>
              <ol className="ml-6 list-decimal space-y-2 text-blue-800 dark:text-blue-200">
                <li>Remove the Nepdora app from Facebook (see Option A)</li>
                <li>
                  Delete your Nepdora account using Method 1 or Method 2 above
                </li>
                <li>We will process your deletion request within 30 days</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              4. What Happens After You Request Deletion
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  1
                </div>
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    Confirmation Email
                  </h3>
                  <p className="text-muted-foreground">
                    You will receive an email confirming we received your
                    deletion request within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  2
                </div>
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    Processing Period
                  </h3>
                  <p className="text-muted-foreground">
                    Your data will be permanently deleted from our active
                    systems within 30 days of receiving your request.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  3
                </div>
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    Backup Systems
                  </h3>
                  <p className="text-muted-foreground">
                    Data in backup systems will be deleted within 90 days
                    following standard data retention practices.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  4
                </div>
                <div>
                  <h3 className="text-foreground mb-2 font-semibold">
                    Final Confirmation
                  </h3>
                  <p className="text-muted-foreground">
                    You will receive a final email confirming that your data has
                    been completely deleted from our systems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              5. Data We May Retain
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              In certain circumstances, we may need to retain some information
              as required by law or for legitimate business purposes:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>
                Transaction records for tax and accounting purposes (up to 7
                years)
              </li>
              <li>
                Information necessary to resolve disputes or enforce agreements
              </li>
              <li>Data required for legal compliance and fraud prevention</li>
              <li>Anonymous usage data that cannot be linked back to you</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              This data will be retained only for as long as legally required
              and will be securely deleted thereafter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              6. Important Notes
            </h2>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
              <ul className="ml-6 list-disc space-y-3 text-amber-900 dark:text-amber-100">
                <li>
                  <strong>Irreversible Action:</strong> Data deletion is
                  permanent and cannot be undone. Make sure you&apos;ve backed
                  up any information you want to keep.
                </li>
                <li>
                  <strong>Account Access:</strong> Once your data is deleted,
                  you will no longer be able to access your account or any
                  associated services.
                </li>
                <li>
                  <strong>Active Subscriptions:</strong> Cancel any active
                  subscriptions before requesting data deletion to avoid billing
                  issues.
                </li>
                <li>
                  <strong>Processing Time:</strong> While we aim to process
                  requests quickly, the complete deletion process may take up to
                  30 days.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              7. Questions or Concerns
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              If you have any questions about the data deletion process or need
              assistance, please contact our support team:
            </p>
            <div className="border-border bg-muted/30 rounded-lg border p-6">
              <p className="text-muted-foreground mb-2">
                <strong className="text-foreground">Email:</strong>{" "}
                privacy@nepdora.com
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
                <strong className="text-foreground">Response Time:</strong>{" "}
                Within 48 hours
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-foreground mb-4 text-2xl font-semibold">
              8. Your Rights
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Under data protection laws, you have the right to:
            </p>
            <ul className="text-muted-foreground mb-4 ml-6 list-disc space-y-2">
              <li>Request a copy of your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (right to be forgotten)</li>
              <li>Restrict processing of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              For more information about your privacy rights, please refer to
              our{" "}
              <a
                href="/privacy-policy"
                className="text-primary font-semibold hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </section>
        </div>

        {/* Call to Action */}
        <div className="border-border bg-card mt-12 rounded-lg border p-8 text-center">
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            Ready to Delete Your Data?
          </h2>
          <p className="text-muted-foreground mb-6">
            Choose the method that works best for you
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:privacy@nepdora.com?subject=Data%20Deletion%20Request"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-8 py-3 font-semibold transition-colors"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="border-border bg-background text-foreground hover:bg-muted inline-block rounded-lg border px-8 py-3 font-semibold transition-colors"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
