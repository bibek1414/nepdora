import { Metadata } from "next";
import Link from "next/link";
import {
  Rocket,
  Globe,
  Zap,
  CreditCard,
  Smartphone,
  Layout,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Nepdora | Website Builder Built for Nepal",
  description:
    "Nepdora is a modern website platform built to help Nepali businesses launch, grow, and scale online—without complexity. Build for Nepal. Designed for the future.",
  keywords: [
    "nepdora",
    "website builder nepal",
    "nepali business website",
    "local payment integration",
    "esewa khalti",
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto max-w-6xl px-6 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Rocket className="h-4 w-4" />
              about nepdora
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl mb-6">
              Build for Nepal.
              <span className="text-primary"> Designed for the future.</span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
              Nepdora is a modern website platform built to help Nepali businesses launch, grow, and scale online—without complexity.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl leading-relaxed text-slate-700">
              We combine powerful technology with thoughtful design to create a seamless experience where anyone can build a professional website, manage their business, and reach more customers—all from one place.
            </p>
          </div>
        </div>
      </section>

      {/* New Standard Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                <Globe className="h-4 w-4" />
                a new standard
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                A new standard for going online
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Starting a website in Nepal has traditionally been slow, expensive, and fragmented.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Nepdora changes that.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We bring everything together into a single, intuitive platform—so you can go from idea to live website in minutes, not months. No developers. No technical barriers. Just results.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Minutes</div>
                  <div className="text-sm text-slate-500">from idea to live</div>
                </div>
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Zero</div>
                  <div className="text-sm text-slate-500">technical barriers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Nepdora Different */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
              What makes <span className="text-primary">Nepdora different</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We're not just a website builder. We're infrastructure for modern Nepali businesses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Layout, title: "Design-first experience", desc: "clean, professional websites out of the box" },
              { icon: TrendingUp, title: "Built-in growth tools", desc: "SEO, analytics, and performance optimization" },
              { icon: CreditCard, title: "Local payment integration", desc: "seamlessly accept payments with eSewa & Khalti" },
              { icon: Smartphone, title: "Mobile-first by default", desc: "designed for how Nepal actually uses the internet" },
              { icon: ShieldCheck, title: "All-in-one platform", desc: "no plugins, no patchwork tools" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600 italic">
              Every feature is crafted to remove friction and help you move faster.
            </p>
          </div>
        </div>
      </section>

      {/* Built for Nepal Section */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                🇳🇵 built for nepal
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
                Built for where you are
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Global tools weren't built for Nepal.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Nepdora is. From local payment systems to Nepali-first experiences, everything is designed with the realities of Nepali businesses in mind—so your website doesn't just exist, it performs.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">eSewa</div>
                    <div className="text-xs text-slate-500 mt-1">payment ready</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Khalti</div>
                    <div className="text-xs text-slate-500 mt-1">payment ready</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">NPR</div>
                    <div className="text-xs text-slate-500 mt-1">local pricing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">नेपाली</div>
                    <div className="text-xs text-slate-500 mt-1">language support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speed, Simplicity, Scale */}
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-slate-900 p-10 text-center shadow-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 mb-6">
              <Zap className="h-4 w-4" />
              speed. simplicity. scale.
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Great tools should feel invisible
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              That's why Nepdora focuses on speed — launch instantly, simplicity — no learning curve, and scalability — grow without switching platforms. Whether you're just starting or expanding, Nepdora grows with you.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { label: "launch", value: "instantly" },
                { label: "learning curve", value: "zero" },
                { label: "platform switch", value: "never" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-primary">{item.value}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <TrendingUp className="h-4 w-4" />
            our vision
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Building the digital foundation for the next generation of Nepali businesses
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            A future where anyone—from a local shop owner to a growing brand—can create, compete, and succeed online with the same level of tools as global companies.
          </p>
        </div>
      </section>

      {/* Join the Movement CTA */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Heart className="h-8 w-8" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                Join the movement
              </h2>
              <p className="mx-auto mb-6 max-w-md text-slate-500 leading-relaxed">
                Thousands of businesses across Nepal are already choosing a faster, smarter way to go online.
              </p>
              <p className="mb-8 text-lg font-medium text-primary">
                Now it's your turn.
              </p>
              <Link
                href="/create-website"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-md transition-all hover:scale-105"
              >
                Start building with Nepdora
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}