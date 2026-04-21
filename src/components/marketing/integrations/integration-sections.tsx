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
  const otherIntegrations = INTEGRATIONS.slice(0, 3).filter(
    i => i.name !== activeName
  );

  return (
    <div className="relative">
      <div className="-sm relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-400" />
            <div className="h-2 w-2 rounded-full bg-yellow-400" />
            <div className="h-2 w-2 rounded-full bg-green-400" />
          </div>
          <div className="mx-3 flex-1 rounded border border-slate-200 bg-white px-3 py-1 text-xs text-slate-400">
            nepdora.com/integrations
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Active Integration */}
            <div
              className="-sm flex scale-105 flex-col items-center rounded-xl border-2 bg-white p-4"
              style={{ borderColor: `${color}30` }}
            >
              <div
                className="mb-2 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border bg-white p-2"
                style={{ borderColor: `${color}20` }}
              >
                <Image unoptimized
                  src={activeLogo}
                  alt={activeName}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xs font-medium text-slate-900">
                {activeName}
              </span>
              <span
                className="mt-1 flex items-center gap-1 text-[10px] font-medium"
                style={{ color: color }}
              >
                <div
                  className="h-1 w-1 animate-pulse rounded-full"
                  style={{ backgroundColor: color }}
                />
                Connected
              </span>
            </div>

            {/* Other Integrations */}
            {otherIntegrations.map(app => (
              <div
                key={app.slug}
                className="flex flex-col items-center rounded-xl border border-slate-100 bg-white p-4 opacity-50"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-2">
                  <Image unoptimized
                    src={app.logo}
                    alt={app.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-900">
                  {app.name}
                </span>
                <span className="mt-1 flex items-center gap-1 text-[8px] font-medium text-slate-400">
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                  Disconnected
                </span>
              </div>
            ))}

            {/* Add more */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <div className="-sm mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                Plus 20+ more
              </span>
            </div>
          </div>
        </div>
      </div>
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
    <section className="border-b border-slate-100 bg-white pt-16 pb-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Integrations", href: "/integrations" },
              { label: name, href: "#" },
            ]}
          />
        </div>

        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: `${color}10`, color: color }}
            >
              <div
                className="h-1.5 w-1.5 animate-pulse rounded-full"
                style={{ backgroundColor: color }}
              />
              {badge}
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              {title || (
                <>
                  Connect {name} with <br />
                  your Nepdora site
                </>
              )}
            </h1>

            <p className="mb-6 text-base leading-relaxed text-slate-500 sm:text-lg">
              {subtitle || description}
            </p>

            <Link
              href="/admin/signup"
              className="bg-primary -md inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105"
            >
              Join Nepdora
            </Link>
          </div>

          <div className="shrink-0">
            <div className="-md flex h-40 w-40 items-center justify-center rounded-2xl border border-slate-100 bg-white p-6 lg:h-56 lg:w-56">
              <Image unoptimized
                src={logo}
                alt={name}
                width={200}
                height={200}
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
    <section className="border-t border-slate-50 bg-white py-16 sm:py-20">
      <div className="container mx-auto max-w-6xl px-6">
        <div
          className={cn(
            "grid items-center gap-12 lg:grid-cols-2",
            flip && "text-left lg:[&>*:first-child]:order-2"
          )}
        >
          {/* text */}
          <div className="text-left">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-slate-500">
              {description}
            </p>
            <ul className="space-y-3">
              {bullets.map(b => (
                <li key={b} className="flex items-start gap-2">
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
                  <span className="text-sm leading-relaxed font-medium text-slate-700">
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
              <div className="-sm overflow-hidden rounded-xl border border-slate-100 bg-white">
                <Image unoptimized
                  src={image}
                  alt={title}
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-slate-50 lg:h-72">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, #fff 100%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="-md flex h-16 w-16 items-center justify-center rounded-xl bg-white">
                    <div
                      className="h-6 w-6 animate-pulse rounded-full opacity-50"
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
