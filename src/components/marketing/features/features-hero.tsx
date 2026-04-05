import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedDashboard } from "./animated-dashboard";

export default function FeaturesHero() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — text */}
          <div>
            <h1 className="mb-6 text-5xl leading-[1.08] font-bold tracking-tight text-slate-900 sm:text-6xl">
              Everything you need to{" "}
              <span className="text-indigo-600">scale</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-500">
              One platform built for Nepali businesses — website builder, eSewa
              &amp; Khalti payments, e-commerce, SEO, real-time analytics, and
              much more.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Start Building Free
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — interactive animated dashboard (client component) */}
          <div className="relative lg:pl-6">
            <AnimatedDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
