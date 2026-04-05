import { X } from "lucide-react";

export default function EmpathySection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-2 lg:items-center lg:gap-x-16">
          <div>
            <h2 className="f text-3xl text-slate-900 sm:text-4xl">
              We get it. Hiring a developer in Nepal can be a nightmare.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              You just want to grow your business, but the technical hurdles
              keep getting in the way.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Expensive upfront cost",
                "Weeks of back-and-forth",
                "Can't update content yourself later",
                "No guarantees on quality",
                "Communication issues",
              ].map(item => (
                <div key={item} className="flex items-start">
                  <div className="shrink-0">
                    <X className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="ml-3 text-base font-medium text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12">
            <div className="relative">
              <p className="text-2xl leading-relaxed text-slate-900">
                &quot;That&apos;s why we built Nepdora - so any Nepali business
                owner can have a professional website without depending on
                anyone.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
