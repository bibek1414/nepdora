import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedPricingDashboard } from "./animated-pricing-visual";

export default function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-16 sm:pt-32 sm:pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_70%)]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — text */}
          <div className="relative z-10">
            <h1 className="mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-7xl">
              Plans that grow with your{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">ambition</span>
                <svg
                  className="absolute -bottom-2 left-0 -z-10 h-3 w-full text-indigo-100"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 25 0 50 5 T 100 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                </svg>
              </span>
            </h1>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-slate-500">
              Build, launch, and scale your business online with Nepdora. From
              your first website to managing a growing enterprise in Nepal, we
              provide powerful tools to help you succeed.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="bg-primary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-primary/80 hover:shadow-indigo-300 active:scale-[0.98]"
              >
                Contact Us
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://wa.me/9779866316114"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Talk to Sales
              </Link>
            </div>
          </div>

          {/* Right — interactive animated dashboard */}
          <div className="relative lg:pl-10">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-50/50 blur-3xl" />
            <AnimatedPricingDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
