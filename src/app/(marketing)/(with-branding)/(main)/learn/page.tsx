import { Metadata } from "next";
import Link from "next/link";
import { buildMarketingMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/marketing/layout/breadcrumbs";
import { GraduationCap, PlayCircle, BookOpen, Clock, ChevronRight, Zap } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Nepdora Academy | Learn How to Build and Grow your Business",
  description: "Free courses, tutorials, and guides to help you master website building, e-commerce, and digital marketing in Nepal.",
  path: "/learn",
  ogLabel: "Growth Academy",
});

const COURSES = [
  {
    title: "How to Sell on Facebook in Nepal",
    slug: "how-to-sell-on-facebook-nepal",
    description: "Connect your Nepdora store to Facebook and Instagram for maximum sales.",
    duration: "15 min",
    category: "Social Selling",
  },
  {
    title: "Nepal Courier Services Comparison",
    slug: "nepal-courier-services-comparison",
    description: "Deep dive into Pathao, Upaya, and others for your delivery needs.",
    duration: "20 min",
    category: "Logistics",
  },
  {
    title: "Setting up eSewa & Khalti",
    slug: "esewa-khalti-setup-guide",
    description: "Step-by-step guide to verifying your merchant accounts and linking them.",
    duration: "10 min",
    category: "Payments",
  }
];

export default function LearnHubPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-20 bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto max-w-7xl px-4 text-center">
            <Breadcrumbs 
                items={[{ label: "Academy", href: "/learn" }]} 
            />
            <div className="mt-12 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                    <GraduationCap className="w-4 h-4" />
                    Nepdora Academy
                </div>
                <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 uppercase italic leading-none">
                    Master your <span className="text-primary italic">Digital Brand.</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                    Free education to help Nepali entrepreneurs go from zero to hero.
                </p>
            </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">Featured Courses</h2>
                <Link href="/blog" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                    View All Resources
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {COURSES.map((course) => (
                    <Link key={course.slug} href={`/learn/${course.slug}`} className="group flex flex-col p-8 rounded-[40px] border border-slate-100 bg-white hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                {course.category}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                {course.duration}
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                            {course.title}
                        </h3>
                        <p className="text-slate-600 mb-8 grow">
                            {course.description}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] mt-auto">
                            Start Learning
                            <PlayCircle className="w-4 h-4 fill-primary text-white" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-20 p-12 rounded-[56px] bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                    <div className="max-w-xl">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
                            Need a <span className="text-primary">1-on-1 Consulting</span> Session?
                        </h3>
                        <p className="text-slate-400 font-medium">
                            Our business growth experts can help you design your store and optimize your marketing strategy for the Nepali market.
                        </p>
                    </div>
                    <Link 
                        href="/experts"
                        className="px-8 py-4 rounded-full bg-white text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl"
                    >
                        Talk to an Expert
                    </Link>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
