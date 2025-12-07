import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Check } from "lucide-react";

const Concierge: React.FC = () => {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-16">
          <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row">
            <div className="flex-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase">
                <MessageCircle size={14} /> Concierge Service
              </div>
              <h2 className="mb-6 text-3xl leading-tight font-bold text-slate-900 md:text-5xl">
                Don&apos;t want to build it yourself? <br />
                <span className="text-primary font-serif italic">
                  We&apos;ll do it for free.
                </span>
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-slate-500">
                You&apos;re busy running a business. Tell our team what you
                need, and we&apos;ll craft your site, set up your products, and
                connect your payment gateways. No extra charge.
              </p>

              <ul className="mb-8 space-y-3">
                {[
                  "Professional setup by design experts",
                  "Payment gateway integration (eSewa, Fonepay)",
                  "Domain connection assistance",
                  "1-on-1 onboarding session",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700"
                  >
                    <div className="text-primary flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <Button size="lg">Chat with an Expert</Button>
                <Button variant="outline" size="lg">
                  See Examples
                </Button>
              </div>
            </div>

            <div className="relative w-full flex-1">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 md:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
                  alt="Team working"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                <div className="absolute right-6 bottom-6 left-6 rounded-xl border border-white/50 bg-white/90 p-4 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <img
                        src="https://i.pravatar.cc/100?img=33"
                        className="h-10 w-10 rounded-full border-2 border-white"
                        alt="Support"
                      />
                      <img
                        src="https://i.pravatar.cc/100?img=47"
                        className="h-10 w-10 rounded-full border-2 border-white"
                        alt="Support"
                      />
                      <div className="text-primary flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold">
                        +3
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Dedicated Support Team
                      </div>
                      <div className="text-xs text-slate-500">
                        Available 9AM - 6PM NPT
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Concierge;
