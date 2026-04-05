import type { ReactNode } from "react";
import { Check } from "lucide-react";

/* ─────────────────────────── visual mockups ─────────────────────────── */

function WebsiteBuilderMockup() {
  const templates = [
    { name: "Restaurant", color: "bg-orange-400" },
    { name: "Boutique", color: "bg-pink-400" },
    { name: "Travel", color: "bg-teal-400" },
    { name: "Clinic", color: "bg-blue-400" },
    { name: "Jewellery", color: "bg-amber-400" },
    { name: "Law Firm", color: "bg-slate-400" },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded border border-slate-200 px-3 py-1 text-[11px] text-slate-400">
          nepdora.com/templates
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-800">Choose a template</p>
          <div className="text-[10px] text-indigo-600 font-medium">100+ available</div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {templates.map(t => (
            <div key={t.name} className="rounded-lg overflow-hidden border border-slate-100 cursor-pointer group hover:border-indigo-300 transition-colors">
              <div className={`${t.color} h-16 flex items-end p-2`}>
                <div className="w-full space-y-1">
                  <div className="h-1 w-3/4 rounded bg-white/60" />
                  <div className="h-1 w-1/2 rounded bg-white/40" />
                </div>
              </div>
              <div className="bg-white px-2 py-1.5">
                <p className="text-[10px] font-medium text-slate-700">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-[11px] font-semibold text-white">Customise this template</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsMockup() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded border border-slate-200 px-3 py-1 text-[11px] text-slate-400">
          Payment confirmation
        </div>
      </div>
      <div className="p-5 space-y-4">
        {/* order summary */}
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-[11px] text-slate-500 mb-3 font-medium">Order Summary</p>
          {[
            { item: "Handmade Pashmina Shawl", price: "NPR 4,500" },
            { item: "Thangka Wall Art (A3)", price: "NPR 2,200" },
          ].map(r => (
            <div key={r.item} className="flex items-center justify-between py-1.5 border-b border-slate-200 last:border-0">
              <span className="text-xs text-slate-700">{r.item}</span>
              <span className="text-xs font-semibold text-slate-900">{r.price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 mt-1">
            <span className="text-xs font-bold text-slate-900">Total</span>
            <span className="text-sm font-bold text-indigo-600">NPR 6,700</span>
          </div>
        </div>
        {/* payment options */}
        <p className="text-[11px] font-medium text-slate-500">Pay with</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "eSewa", color: "bg-green-50 border-green-200 text-green-700" },
            { name: "Khalti", color: "bg-purple-50 border-purple-200 text-purple-700" },
            { name: "Fonepay", color: "bg-orange-50 border-orange-200 text-orange-700" },
            { name: "ConnectIPS", color: "bg-blue-50 border-blue-200 text-blue-700" },
          ].map(p => (
            <div key={p.name} className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold cursor-pointer ${p.color}`}>
              {p.name}
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-indigo-600 py-2.5 text-center">
          <span className="text-sm font-semibold text-white">Pay Now</span>
        </div>
      </div>
    </div>
  );
}

function SEOMockup() {
  const keywords = [
    { term: "pashmina shawl kathmandu", pos: 1, change: "+3" },
    { term: "handmade jewellery nepal", pos: 2, change: "+5" },
    { term: "buy thangka art online", pos: 4, change: "+8" },
    { term: "nepal handicraft online store", pos: 3, change: "+2" },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded border border-slate-200 px-3 py-1 text-[11px] text-slate-400">
          SEO Dashboard
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Google Ranking", value: "#1–4", color: "text-emerald-600" },
            { label: "Organic Visits", value: "3,240/mo", color: "text-indigo-600" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] text-slate-400 mb-1">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-500 mb-2">Keyword Rankings</p>
          <div className="space-y-2">
            {keywords.map(k => (
              <div key={k.term} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-[11px] text-slate-700 flex-1">{k.term}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-emerald-600 font-semibold">{k.change}</span>
                  <span className="text-[11px] font-bold text-indigo-600">#{k.pos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
          <p className="text-[11px] font-semibold text-emerald-700">Auto-generated for you</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Meta tags · Schema markup · XML sitemap · Open Graph</p>
        </div>
      </div>
    </div>
  );
}

function EcommerceMockup() {
  const orders = [
    { id: "#1042", customer: "Aarav Shrestha", amount: "NPR 5,400", status: "Shipped" },
    { id: "#1041", customer: "Priya Tamang", amount: "NPR 2,800", status: "Paid" },
    { id: "#1040", customer: "Rohan KC", amount: "NPR 9,200", status: "Processing" },
    { id: "#1039", customer: "Nisha Rai", amount: "NPR 1,650", status: "Paid" },
  ];
  const statusColor: Record<string, string> = {
    Shipped: "text-blue-600 bg-blue-50",
    Paid: "text-emerald-600 bg-emerald-50",
    Processing: "text-amber-600 bg-amber-50",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded border border-slate-200 px-3 py-1 text-[11px] text-slate-400">
          Orders — Store Admin
        </div>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Recent Orders</p>
          <div className="rounded-md bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold text-white">
            + New Order
          </div>
        </div>
        <div className="space-y-1.5">
          {orders.map(o => (
            <div key={o.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
              <div>
                <p className="text-[11px] font-semibold text-slate-800">{o.customer}</p>
                <p className="text-[10px] text-slate-400">{o.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-900">{o.amount}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[o.status]}`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: "Products", value: "84" },
            { label: "Stock Alerts", value: "3" },
            { label: "Revenue", value: "NPR 2.4M" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-2.5 text-center">
              <p className="text-xs font-bold text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [42, 58, 47, 73, 65, 89];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded border border-slate-200 px-3 py-1 text-[11px] text-slate-400">
          Analytics Dashboard
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Visitors", value: "24,810", change: "+34%", up: true },
            { label: "Conversion Rate", value: "4.2%", change: "+1.1%", up: true },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">{s.label}</p>
              <p className="text-sm font-bold text-slate-900">{s.value}</p>
              <p className="text-[10px] font-semibold text-emerald-600">{s.change}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <p className="text-[11px] font-medium text-slate-500 mb-3">Revenue Trend</p>
          <div className="flex items-end gap-2 h-20">
            {values.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-indigo-500"
                  style={{ height: `${v}%`, opacity: 0.4 + (v / 100) * 0.6 }}
                />
                <span className="text-[9px] text-slate-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-slate-500">Top Traffic Sources</p>
          {[
            { source: "Google Search", pct: 58 },
            { source: "Direct", pct: 24 },
            { source: "Social Media", pct: 18 },
          ].map(s => (
            <div key={s.source} className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600 w-28 shrink-0">{s.source}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: `${s.pct}%` }} />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 w-8 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessOpsMockup() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-3 bg-white rounded border border-slate-200 px-3 py-1 text-[11px] text-slate-400">
          Business Hub
        </div>
      </div>
      <div className="p-5 space-y-3">
        {/* SMS notification */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-sm bg-green-600" />
            </div>
            <p className="text-[11px] font-semibold text-slate-800">SMS Notification Sent</p>
          </div>
          <p className="text-[10px] text-slate-500 font-mono bg-white rounded p-2 border border-slate-100">
            "Your order #1042 has been dispatched. Track: bit.ly/nepdora-1042"
          </p>
        </div>
        {/* CRM contacts */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 mb-2">Recent Customers</p>
          {[
            { name: "Meena Adhikari", orders: 8, total: "NPR 34,200" },
            { name: "Bikram Poudel", orders: 3, total: "NPR 12,800" },
            { name: "Kabita Gurung", orders: 5, total: "NPR 21,400" },
          ].map(c => (
            <div key={c.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-indigo-700">{c.name[0]}</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800">{c.name}</p>
                  <p className="text-[9px] text-slate-400">{c.orders} orders</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-900">{c.total}</span>
            </div>
          ))}
        </div>
        {/* Booking */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-indigo-800">3 new bookings today</p>
          <p className="text-[10px] text-indigo-600 mt-0.5">Appointment system · Calendar sync</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── section data ─────────────────────────── */

const sections = [
  {
    title: "Build a stunning website in minutes",
    description:
      "Choose from 100+ industry-specific templates and make it yours with our drag-and-drop editor — no code, no designer, no waiting.",
    bullets: [
      "100+ mobile-ready professional templates",
      "Drag-and-drop visual editor",
      "Custom domain with free SSL",
      "AI-assisted content and layout suggestions",
    ],
    visual: <WebsiteBuilderMockup />,
    flip: false,
    bg: "bg-white",
  },
  {
    title: "Accept Nepal's favourite payments, instantly",
    description:
      "Connect eSewa, Khalti, Fonepay, and ConnectIPS with a few clicks. No developer needed — your customers pay the way they're already used to.",
    bullets: [
      "eSewa & Khalti built in",
      "Fonepay & ConnectIPS support",
      "Stripe & PayPal for international sales",
      "Secure, encrypted transactions",
    ],
    visual: <PaymentsMockup />,
    flip: true,
    bg: "bg-white",
  },
  {
    title: "Rank on Google without hiring an agency",
    description:
      "Nepdora automatically generates meta tags, schema markup, and XML sitemaps. Get found when customers search — no SEO expertise required.",
    bullets: [
      "Auto meta tags and Open Graph tags",
      "JSON-LD schema markup",
      "XML sitemap auto-generation",
      "Core Web Vitals and page speed optimised",
    ],
    visual: <SEOMockup />,
    flip: false,
    bg: "bg-white",
  },
  {
    title: "Run your entire store from one dashboard",
    description:
      "List products, process orders, manage inventory, and print invoices — all from a single clean dashboard built for Nepali sellers.",
    bullets: [
      "Unlimited product listings",
      "Order management and tracking",
      "POS system for physical stores",
      "Inventory and low-stock alerts",
    ],
    visual: <EcommerceMockup />,
    flip: true,
    bg: "bg-white",
  },
  {
    title: "Know your numbers at a glance",
    description:
      "Real-time dashboards show you exactly where visitors come from, what they buy, and how your revenue is growing — so you can make smart decisions fast.",
    bullets: [
      "Real-time traffic and revenue tracking",
      "Traffic source breakdown",
      "Conversion rate and best-seller reports",
      "Visitor demographics",
    ],
    visual: <AnalyticsMockup />,
    flip: false,
    bg: "bg-white",
  },
  {
    title: "Manage customers, SMS and bookings in one place",
    description:
      "Keep a mini-CRM, send automated SMS order updates, and let customers book appointments — everything your business needs to run smoothly.",
    bullets: [
      "Mini CRM and customer database",
      "Automated SMS order notifications",
      "Appointment and booking system",
      "Lead and inquiry management",
    ],
    visual: <BusinessOpsMockup />,
    flip: true,
    bg: "bg-white",
  },
];

/* ─────────────────────────── section component ─────────────────────────── */

function ShowcaseSection({
  title,
  description,
  bullets,
  visual,
  flip,
  bg,
}: {
  title: string;
  description: string;
  bullets: string[];
  visual: ReactNode;
  flip: boolean;
  bg: string;
}) {
  return (
    <section className={`${bg} border-t border-slate-100 py-20 sm:py-28`}>
      <div className="mx-auto max-w-5xl px-6">
        <div
          className={`grid items-center gap-14 lg:grid-cols-2 ${
            flip ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* text */}
          <div>
            <h2 className="mb-5 text-3xl font-bold leading-snug tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mb-7 text-base leading-relaxed text-slate-500">{description}</p>
            <ul className="space-y-3">
              {bullets.map(b => (
                <li key={b} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                    <Check className="h-3 w-3 text-indigo-600" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* visual */}
          <div>{visual}</div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── export ─────────────────────────── */

export default function FeatureShowcase() {
  return (
    <>
      {sections.map(s => (
        <ShowcaseSection key={s.title} {...s} />
      ))}
    </>
  );
}
