import { Metadata } from "next";
import CTASection from "@/components/marketing/cta-section/cta-section";
import { JsonLd } from "@/components/shared/json-ld";
import { industries, INDUSTRY_LABELS } from "@/lib/seo-data";
import { capitalizeWords } from "@/lib/string-utils";
import Link from "next/link";
import { TemplateSection } from "@/components/marketing/templates/template-section";

interface Props {
  params: Promise<{ industry: string; city: string }>;
}

export async function generateStaticParams() {
  // Return empty and use Incremental Static Regeneration (ISR) or on-demand
  return []; 
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, city } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  return {
    title: `Best ${industryLabel} Website in ${cityName} | #1 Choice in Nepal`,
    description: `Need a website for your ${industryLabel.toLowerCase()} in ${cityName}? Nepdora provides localized templates, eSewa/Khalti integration, and local SEO to help you rank #1.`,
  };
}

export default async function ProgrammaticIndustryCityPage({ params }: Props) {
  const { industry, city } = await params;
  const industryLabel = INDUSTRY_LABELS[industry] || capitalizeWords(industry);
  const cityName = capitalizeWords(city);

  // LOCAL CONTENT MAPPING (In real app, this would be a CMS query)
  const cityFeatures: Record<string, string[]> = {
    kathmandu: ["KTM Express Delivery Integration", "Local Pickup Points in Valley"],
    pokhara: ["Lakeside Booking Engine", "Tourism Specific SEO"],
    default: ["Integrated local payments", "Mobile optimized design"]
  };

  const industryFeatures: Record<string, { title: string; desc: string; icon: string }[]> = {
    restaurant: [
      { title: "QR Digital Menu", desc: "No more paper menus for your restaurant.", icon: "🍴" },
      { title: "Table Booking", desc: "Let customers in " + cityName + " book tables online.", icon: "📅" }
    ],
    clinic: [
      { title: "Doctor Scheduling", desc: "Patient appointment portal for " + cityName + " practices.", icon: "🩺" },
      { title: "Medical Blog", desc: "Share health tips with your " + cityName + " patients.", icon: "📝" }
    ],
    default: [
      { title: "AI Site Wizard", desc: "Get online in " + cityName + " in under 10 minutes.", icon: "⚡" },
      { title: "E-payment Ready", desc: "Accept eSewa & Khalti in " + cityName + ".", icon: "💳" }
    ]
  };

  const localFeatures = cityFeatures[city.toLowerCase()] || cityFeatures.default;
  const currentIndustryFeatures = industryFeatures[industry] || industryFeatures.default;

  return (
    <main className="bg-white min-h-screen">
      <JsonLd id="pseo-industry-city" data={{ "@context": "https://schema.org", "@type": "Service", "name": `${industryLabel} in ${cityName}` }} />
      
      {/* Dynamic Hero with Specific industry + city markers */}
      <section className="relative py-20 overflow-hidden bg-slate-950 text-white">
        <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-6 py-2 rounded-full bg-primary/20 text-primary text-sm font-bold mb-8 border border-primary/30 animate-pulse">
                    #1 {industryLabel} Solution for {cityName} Businesses
                </span>
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
                    Empowering <span className="underline decoration-primary decoration-8 underline-offset-8">{industryLabel}s</span> in <span className="text-primary italic">{cityName}</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-light">
                    The fastest way to grow your {industryLabel.toLowerCase()} business in {cityName}. 
                    Localized for the Nepalese market with built-in {localFeatures[0]}.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link href="/register" className="px-10 py-5 bg-primary text-white rounded-full font-black text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
                        Start Your {cityName} Website
                    </Link>
                    <Link href="/templates" className="px-10 py-5 bg-white/5 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all border border-white/10 backdrop-blur-sm">
                        View {industryLabel} Demo
                    </Link>
                </div>
            </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 pointer-events-none" />
      </section>

      {/* Localized "Why Now" Section (Anti-Duplicate) */}
      <section className="py-24 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-20">
                      <div>
                          <h2 className="text-4xl font-bold mb-8 text-slate-900">
                              Why {industryLabel}s in {cityName} are switching to Nepdora
                          </h2>
                          <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                              Traditional agencies in {cityName} charge too much and take too long. 
                              Nepdora gives you a professional {industryLabel.toLowerCase()} website with 
                              market-leading features specifically designed for local {cityName} users.
                          </p>
                          <div className="grid gap-6">
                              {currentIndustryFeatures.map((f, i) => (
                                  <div key={i} className="flex gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                      <div className="text-3xl">{f.icon}</div>
                                      <div>
                                          <h4 className="font-bold text-slate-900">{f.title}</h4>
                                          <p className="text-slate-600">{f.desc}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-6">
                              <div className="aspect-square bg-slate-100 rounded-3xl p-8 flex flex-col justify-end">
                                  <div className="text-4xl font-black text-primary mb-2">99%</div>
                                  <div className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-tight">Uptime for {cityName} Sites</div>
                              </div>
                              <div className="aspect-3/4 bg-slate-900 rounded-3xl p-8 text-white">
                                  <div className="text-4xl font-black mb-4">SEO</div>
                                  <p className="text-slate-400">Optimized for "{industryLabel} in {cityName}" searches.</p>
                              </div>
                          </div>
                          <div className="pt-12 space-y-6">
                              <div className="aspect-3/4 bg-primary rounded-3xl p-8 text-white">
                                  <div className="text-4xl font-black mb-4">Rs 0</div>
                                  <p className="text-primary-foreground/80">Hosting cost for your {cityName} startup.</p>
                              </div>
                              <div className="aspect-square bg-slate-100 rounded-3xl p-8 flex flex-col justify-end">
                                  <div className="text-4xl font-black text-slate-900 mb-2">eSewa</div>
                                  <div className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-tight">Built-in Payment</div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Local Social Proof Section */}
      <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Empowering {cityName}'s Small Businesses</h2>
              <p className="text-xl text-slate-600">Join thousands of entrepreneurs in {cityName} who chose Nepdora.</p>
          </div>
          <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                  {/* Localized Testimonial Generator */}
                  {[1, 2, 3].map((i) => (
                      <div key={i} className="p-10 bg-white rounded-4xl shadow-sm border border-slate-200 hover:shadow-xl transition-all">
                          <div className="flex gap-1 mb-6 text-yellow-400">
                             {[1,2,3,4,5].map(s => <span key={s}>★</span>)}
                          </div>
                          <p className="text-slate-600 mb-8 leading-relaxed italic text-lg">
                            " {i === 1 ? `Best decision for our ${industryLabel.toLowerCase()} in ${cityName}.` : i === 2 ? `Everything from eSewa to Pathao works perfectly in ${cityName}.` : `Support was amazing and they know the ${cityName} market.`} "
                          </p>
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-100 rounded-full font-bold text-primary flex items-center justify-center">
                                  {cityName[i % cityName.length]}
                              </div>
                              <div className="text-left">
                                  <h4 className="font-bold text-slate-900 text-sm italic">Verified Business</h4>
                                  <p className="text-xs text-slate-500">{industryLabel} in {cityName}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Industry Specific Templates */}
      <div className="py-12">
        <TemplateSection title={`Pick the Perfect ${industryLabel} Template for ${cityName}`} category={industry} />
      </div>

      <CTASection />
    </main>
  );
}
