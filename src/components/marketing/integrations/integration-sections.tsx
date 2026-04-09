import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { INTEGRATIONS } from "@/constants/integrations";

/* ─────────────────────────── Connection Mockup ─────────────────────────── */

export function ConnectionMockup({
  activeName,
  activeLogo,
  color,
}: {
  activeName: string;
  activeLogo: string;
  color: string;
}) {
  // Get other integrations for the mockup grid
  const otherIntegrations = INTEGRATIONS.slice(0, 3).filter(
    i => i.name !== activeName
  );

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* browser chrome */}
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <div className="h-2 w-2 rounded-full bg-green-400" />
          </div>
          <div className="mx-3 flex-1 rounded border border-slate-200 bg-white px-3 py-1 text-[10px] text-slate-400">
            nepdora.com/integrations
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Active Integration (Highlighted) */}
            <div
              className="flex scale-105 flex-col items-center rounded-xl border-2 bg-white/50 p-4 shadow-lg shadow-slate-100 transition-all"
              style={{ borderColor: `${color}40` }}
            >
              <div
                className="mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 shadow-sm"
                style={{ borderColor: `${color}20` }}
              >
                <Image
                  src={activeLogo}
                  alt={activeName}
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold text-slate-900">
                {activeName}
              </span>
              <span
                className="mt-1 flex items-center gap-1 text-[8px] font-bold"
                style={{ color: color }}
              >
                <div
                  className="h-1 w-1 animate-pulse rounded-full"
                  style={{ backgroundColor: color }}
                />
                Connected
              </span>
            </div>

            {/* Other Integrations (Faded) */}
            {otherIntegrations.map(app => (
              <div
                key={app.slug}
                className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 opacity-50 transition-all hover:opacity-100"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                  <Image
                    src={app.logo}
                    alt={app.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-900">
                  {app.name}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[8px] font-medium text-slate-400">
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                  Disconnected
                </span>
              </div>
            ))}

            {/* Empty/Add more state */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <Zap className="h-4 w-4" fill="currentColor" />
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                Plus 20+ more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div
        className="absolute -top-10 -right-10 -z-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: color }}
      />
      <div className="absolute -bottom-10 -left-10 -z-10 h-32 w-32 rounded-full bg-sky-100 opacity-30 blur-3xl" />
    </div>
  );
}

/* ─────────────────────────── Integration Hero ─────────────────────────── */

interface IntegrationHeroProps {
  name: string;
  logo: string;
  color: string;
  badge: string;
  title?: string;
  subtitle?: string;
  description: string;
}

export function IntegrationHero({
  name,
  logo,
  color,
  badge,
  title,
  subtitle,
  description,
}: IntegrationHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-50 bg-white pt-12 pb-20 text-slate-900">
      {/* Background Decorative Elements */}
      <div
        className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full opacity-[0.03] blur-[120px]"
        style={{ backgroundColor: color }}
      />

      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Integrations", href: "/integrations" },
              { label: name, href: "#" },
            ]}
          />
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all"
              style={{
                backgroundColor: `${color}10`,
                color: color,
              }}
            >
              <div
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: color }}
              />
              {badge}
            </div>

            <h1 className="mb-4 text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-7xl">
              {title || (
                <>
                  Connect {name} with <br />
                  your Nepdora site
                </>
              )}
            </h1>

            <p className="mx-auto mb-7 text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0 lg:text-xl">
              {subtitle || description}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/admin/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-10 py-4 text-base font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-slate-200 active:scale-95"
              >
                Join Nepdora
              </Link>
            </div>
          </div>

          <div className="relative shrink-0">
            <div
              className="absolute -inset-10 rounded-full opacity-10 blur-3xl lg:-inset-20"
              style={{ backgroundColor: color }}
            />
            <div className="relative flex h-48 w-48 items-center justify-center rounded-[40px] border border-slate-50 bg-white p-8 shadow-2xl shadow-slate-100 lg:h-64 lg:w-64">
              <Image
                src={logo}
                alt={name}
                width={256}
                height={256}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Showcase Row ─────────────────────────── */

interface ShowcaseSectionProps {
  title: string;
  description: string;
  bullets: string[];
  image?: string;
  visual?: ReactNode;
  flip?: boolean;
  color: string;
}

export function IntegrationShowcaseSection({
  title,
  description,
  bullets,
  image,
  visual,
  flip,
  color,
}: ShowcaseSectionProps) {
  return (
    <section className="border-t border-slate-50 bg-white py-20 sm:py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <div
          className={cn(
            "grid items-center gap-14 lg:grid-cols-2",
            flip && "text-left lg:[&>*:first-child]:order-2"
          )}
        >
          {/* text */}
          <div className="text-left">
            <h2 className="mb-5 text-3xl leading-snug font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mb-7 text-base leading-relaxed text-slate-500 sm:text-lg">
              {description}
            </p>
            <ul className="space-y-4">
              {bullets.map(b => (
                <li key={b} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <Check
                      className="h-3 w-3"
                      style={{ color: color }}
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-sm leading-relaxed font-medium text-slate-700 sm:text-base">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* visual */}
          <div className="relative flex justify-center lg:block">
            {visual ? (
              visual
            ) : image ? (
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
                <Image
                  src={image}
                  alt={title}
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-64 w-full overflow-hidden rounded-[32px] lg:h-80">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, #fff 100%)`,
                    backgroundImage: `radial-gradient(circle at 20% 20%, ${color} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${color} 0%, transparent 50%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="h-32 w-32 rounded-3xl opacity-20 blur-2xl"
                    style={{ backgroundColor: color }}
                  />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl">
                    <div
                      className="h-8 w-8 animate-pulse rounded-full opacity-50"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
