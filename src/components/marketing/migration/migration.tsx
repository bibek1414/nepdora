import React from "react";
import { ChevronRight, Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const Migration: React.FC = () => {
  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Card className="border-slate-200">
              <CardContent className="p-8 md:p-10">
                <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-6">
                  <div className="opacity-50 grayscale">
                    <p className="mb-1 text-xs font-bold tracking-wide text-slate-500 uppercase">
                      Traditional Hosting
                    </p>
                    <p className="decoration-destructive text-xl font-bold text-slate-400 line-through decoration-2">
                      Rs 25,000<span className="text-sm font-normal">/yr</span>
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Hosting + SSL + AMC
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1 text-xs font-bold tracking-wide text-black uppercase">
                      Nepdora Plan
                    </p>
                    <p className="text-4xl font-bold text-slate-900">
                      Rs 10,000
                      <span className="text-sm font-normal text-slate-500">
                        /yr
                      </span>
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      No hidden charges.
                    </p>
                  </div>
                </div>

                <h3 className="mb-0 text-lg font-bold text-slate-900">
                  Claim Your Free Transfer
                </h3>
                <p className="mb-10 text-sm text-slate-500">
                  You only start paying the flat yearly fee once you're live.
                </p>

                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="website-url"
                      className="text-xs font-bold text-slate-500 uppercase"
                    >
                      Website URL
                    </Label>
                    <Input
                      id="website-url"
                      type="text"
                      placeholder="www.yourcurrentsite.com"
                      className="focus:border-primary transition-colors placeholder:text-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-xs font-bold text-slate-500 uppercase"
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Full Name"
                        className="focus:border-primary transition-colors placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-xs font-bold text-slate-500 uppercase"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="98XXXXXXXX"
                        className="focus:border-primary transition-colors placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <Button className="w-full justify-center rounded-full py-6 text-base">
                    Start Free Transfer{" "}
                    <ChevronRight size={18} className="ml-2" />
                  </Button>
                </form>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                  <Shield size={12} /> 100% Uptime Guarantee
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
              <Zap size={14} className="text-primary fill-current" />
              <span className="text-xs font-bold text-slate-700">
                Switch & Save
              </span>
            </div>

            <h2 className="mb-6 text-3xl leading-tight font-normal text-slate-900 md:text-5xl">
              One Price. <br />
              <span className="font-bold">Everything Included.</span>
            </h2>

            <p className="mb-8 text-lg leading-relaxed font-light text-slate-500">
              Stop paying separately for domain renewals, hosting space, SSL
              certificates, and "maintenance fees". With Nepdora, you pay a flat{" "}
              <strong>Rs 10,000 per year</strong>. That's it.
            </p>

            <ul className="space-y-5">
              {[
                "Free specialized migration service (Worth Rs 15,000)",
                "Cloud hosting & Unlimited bandwidth included",
                "Corporate SSL Security included",
                "Daily backups & Technical maintenance included",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="font-medium text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Migration;
