import Link from "next/link";
import { ChevronRight, Rocket } from "lucide-react";
import { MissionVisual } from "./mission-visual";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Subtle top gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left - text */}
          <div>
            <h1 className="mb-6 text-5xl leading-[1.08] font-bold tracking-tight text-slate-900 sm:text-6xl">
              Build for Nepal. <br />
              <span className="text-primary">Designed for the future.</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-slate-500">
              Nepdora is a modern website platform built to help Nepali
              businesses launch, grow, and scale online—without complexity.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/admin/signup"
                className="-sm bg-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white transition hover:scale-105 active:scale-95"
              >
                Start building with Nepdora
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8 border-slate-100 pt-10">
              <div>
                <p className="text-2xl font-bold text-slate-900">15k+</p>
                <p className="text-xs font-medium text-slate-400">Founders</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs font-medium text-slate-400">Nepal Made</p>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="text-xs font-medium text-slate-400">
                  Local Support
                </p>
              </div>
            </div>
          </div>

          {/* Right - Interactive mission visual */}
          <div className="mr-auto pb-12">
            <MissionVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
