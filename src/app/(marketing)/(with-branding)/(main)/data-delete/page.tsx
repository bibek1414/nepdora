import { Metadata } from "next";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";
import Link from "next/link";
import {
  ShieldCheck,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Facebook,
  User,
  Lock,
} from "lucide-react";

import { buildMarketingMetadata } from "@/lib/seo";

export const metadata = buildMarketingMetadata({
  title: "Data Deletion Instructions | Nepdora",
  description:
    "Find out how to permanently delete your account and personal data from Nepdora, including information collected via Facebook Login. Follow our step-by-step instructions.",
  path: "/data-delete",
  keywords: [
    "data deletion",
    "delete Nepdora account",
    "remove personal data",
    "Facebook data removal",
    "right to be forgotten",
  ],
});

export default function DataDeletionPage() {
  const lastUpdated = "April 10, 2026";

  const deletionSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Data Deletion Instructions | Nepdora",
    description: "How to request deletion of your personal data and account from Nepdora.",
    lastReviewed: "2026-04-10",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Delete Your Nepdora Account",
    step: [
      {
        "@type": "HowToStep",
        name: "Log in",
        text: "Log in to your Nepdora account dashboard.",
      },
      {
        "@type": "HowToStep",
        name: "Go to Admin Settings",
        text: "Navigate to Admin Dashboard → Settings → Account Settings.",
      },
      {
        "@type": "HowToStep",
        name: "Delete Account",
        text: "Scroll to the Danger Zone and click Delete Account.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="deletion-schema" data={deletionSchema} />
      <JsonLd id="how-to-delete" data={howToSchema} />
      <div className="container mx-auto max-w-4xl px-6 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-medium">
            <ShieldCheck className="h-4 w-4" />
            Your Data, Your Control
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Data Deletion Instructions
          </h1>
          <p className="text-slate-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Quick Contact Info */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 -sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Email Us</p>
                <a
                  href="mailto:nepdoranepal@gmail.com"
                  className="hover:text-primary text-sm font-semibold text-slate-900"
                >
                  nepdoranepal@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Call Us</p>
                <a
                  href="tel:+9779866316114"
                  className="hover:text-primary text-sm font-semibold text-slate-900"
                >
                  +977 9866316114
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Visit Us</p>
                <p className="text-sm font-semibold text-slate-900">
                  Sankhamul, Lalitpur, Nepal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 -sm">
          <p className="text-base leading-relaxed font-medium text-slate-600">
            At Nepdora, we respect your privacy and your right to control your
            personal data. This page provides instructions on how to request
            deletion of your data from our platform, including data associated
            with Facebook Login.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Section 1: What Data We Store */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              1. What Data We Store
            </h2>
            <p className="mb-4 text-slate-600">
              When you use our services, we may collect and store the following
              information:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-slate-600">
              <li>
                Account information (name, email address, profile picture)
              </li>
              <li>Facebook profile data (if you sign in with Facebook)</li>
              <li>Store data (products, orders, customers)</li>
              <li>Usage data and preferences</li>
              <li>Transaction history (if applicable)</li>
              <li>Communication history with our support team</li>
            </ul>
          </section>

          {/* Section 2: How to Request Data Deletion */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              2. How to Request Data Deletion
            </h2>
            <p className="mb-4 text-slate-600">
              You can request deletion of your data through the following
              methods:
            </p>

            {/* Method 1: Delete via Account Settings */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Method 1: Delete via Account Settings
                </h3>
              </div>
              <ol className="ml-6 list-decimal space-y-2 text-slate-600">
                <li>Log in to your Nepdora account</li>
                <li>Go to Admin Dashboard → Settings → Account Settings</li>
                <li>Scroll down to the &quot;Danger Zone&quot; section</li>
                <li>Click on &quot;Delete Account&quot; button</li>
                <li>
                  Confirm your decision by following the on-screen prompts
                </li>
              </ol>
              <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                <strong>Note:</strong> After clicking delete, your account will
                be scheduled for deletion. You have 7 days to cancel the
                request. After 7 days, all your store data will be permanently
                removed.
              </div>
            </div>

            {/* Method 2: Email Request */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <Mail className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Method 2: Email Request
                </h3>
              </div>
              <p className="mb-3 text-slate-600">
                Send an email to our data protection team with your deletion
                request:
              </p>
              <div className="rounded-lg bg-white p-4 -sm">
                <p className="mb-2">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:nepdoranepal@gmail.com"
                    className="text-primary hover:underline"
                  >
                    nepdoranepal@gmail.com
                  </a>
                </p>
                <p className="mb-2">
                  <strong>Subject:</strong> Data Deletion Request
                </p>
                <p className="text-slate-600">
                  <strong>Include:</strong> Your full name, email address, and
                  store name (if applicable)
                </p>
              </div>
            </div>

            {/* Method 3: Contact Form */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Method 3: Contact Form
                </h3>
              </div>
              <p className="mb-3 text-slate-600">
                Fill out our contact form with your deletion request:
              </p>
              <Link
                href="/contact"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white -md transition-all hover:scale-105"
              >
                Submit Deletion Request
              </Link>
            </div>
          </section>

          {/* Section 3: Facebook Login Data Deletion */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              3. Facebook Login Data Deletion
            </h2>
            <p className="mb-4 text-slate-600">
              If you signed up using Facebook Login, you have additional
              options:
            </p>

            <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Option A: Remove App from Facebook
                </h3>
              </div>
              <ol className="ml-6 list-decimal space-y-2 text-blue-800">
                <li>Go to your Facebook Settings</li>
                <li>Click on &quot;Apps and Websites&quot;</li>
                <li>Find &quot;Nepdora&quot; in the list</li>
                <li>Click &quot;Remove&quot;</li>
                <li>Confirm the removal</li>
              </ol>
              <p className="mt-4 text-sm text-blue-700">
                Note: This will revoke Nepdora's access to your Facebook data,
                but you must also delete your Nepdora account separately to
                remove data from our servers.
              </p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Option B: Complete Data Deletion
                </h3>
              </div>
              <p className="mb-3 text-blue-800">
                For complete deletion of all data associated with your Facebook
                account:
              </p>
              <ol className="ml-6 list-decimal space-y-2 text-blue-800">
                <li>Remove the Nepdora app from Facebook (see Option A)</li>
                <li>
                  Delete your Nepdora account using Method 1 or Method 2 above
                </li>
                <li>We will process your deletion request within 30 days</li>
              </ol>
            </div>
          </section>

          {/* Section 4: What Happens After You Request Deletion */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              4. What Happens After You Request Deletion
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white">
                  1
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    7-Day Grace Period
                  </h3>
                  <p className="text-slate-600">
                    After requesting deletion, your account enters a 7-day grace
                    period. You can log in and cancel the deletion request at
                    any time during this period.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white">
                  2
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    Confirmation Email
                  </h3>
                  <p className="text-slate-600">
                    You will receive an email confirming we received your
                    deletion request within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white">
                  3
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    Permanent Deletion
                  </h3>
                  <p className="text-slate-600">
                    After the 7-day grace period ends, your data will be
                    permanently deleted from our active systems.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white">
                  4
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    Final Confirmation
                  </h3>
                  <p className="text-slate-600">
                    You will receive a final email confirming that your data has
                    been completely deleted from our systems.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Data We May Retain */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              5. Data We May Retain
            </h2>
            <p className="mb-4 text-slate-600">
              In certain circumstances, we may need to retain some information
              as required by law or for legitimate business purposes:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-slate-600">
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
          </section>

          {/* Section 6: Important Notes */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 -sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h2 className="mb-3 text-xl font-bold text-amber-900">
                  Important Notes
                </h2>
                <ul className="ml-5 list-disc space-y-2 text-amber-800">
                  <li>
                    <strong>Irreversible Action:</strong> Data deletion is
                    permanent and cannot be undone after the 7-day grace period.
                  </li>
                  <li>
                    <strong>Account Access:</strong> Once your data is deleted,
                    you will no longer be able to access your account or any
                    associated services.
                  </li>
                  <li>
                    <strong>Active Subscriptions:</strong> Cancel any active
                    subscriptions before requesting data deletion to avoid
                    billing issues.
                  </li>
                  <li>
                    <strong>7-Day Cancellation:</strong> You can cancel the
                    deletion request within 7 days by logging into your account.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Contact Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              6. Contact Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 flex items-center gap-2">
                  <Mail className="text-primary h-4 w-4" />
                  <strong>Email:</strong>
                </p>
                <a
                  href="mailto:nepdoranepal@gmail.com"
                  className="text-primary hover:underline"
                >
                  nepdoranepal@gmail.com
                </a>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 flex items-center gap-2">
                  <Phone className="text-primary h-4 w-4" />
                  <strong>Phone:</strong>
                </p>
                <a
                  href="tel:+9779866316114"
                  className="text-primary hover:underline"
                >
                  +977 9866316114
                </a>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 flex items-center gap-2">
                  <MapPin className="text-primary h-4 w-4" />
                  <strong>Address:</strong>
                </p>
                <p className="text-slate-600">Sankhamul, Lalitpur, Nepal</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 flex items-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  <strong>Response Time:</strong>
                </p>
                <p className="text-slate-600">Within 48 hours</p>
              </div>
            </div>
          </section>

          {/* Section 8: Your Rights */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              7. Your Rights
            </h2>
            <p className="mb-4 text-slate-600">
              Under data protection laws, you have the right to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-slate-600">
              <li>Request a copy of your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (right to be forgotten)</li>
              <li>Restrict processing of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4 text-slate-600">
              For more information about your privacy rights, please refer to
              our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center -sm">
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Trash2 className="h-8 w-8" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Ready to Delete Your Data?
            </h2>
            <p className="mb-6 text-slate-600">
              Choose the method that works best for you
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="mailto:nepdoranepal@gmail.com?subject=Data%20Deletion%20Request"
                className="bg-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white -md transition-all hover:scale-105"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 -sm transition-all hover:bg-slate-50"
              >
                Contact Form
              </Link>
              <a
                href="tel:+9779866316114"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 -sm transition-all hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
