const resources = [
  {
    title: "Local SEO for Nepali Businesses",
    desc: "How to rank for localized searches in Nepal - practical tips for Google Maps, meta tags, and schema markup.",
    image:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=70",
    alt: "Local SEO guide for Nepal",
  },
  {
    title: "Mastering Online Payments in Nepal",
    desc: "Everything you need to know about accepting eSewa, Khalti, and ConnectIPS on your Nepdora store.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=70",
    alt: "Online payment guide Nepal",
  },
  {
    title: "Build Your Website in 10 Minutes",
    desc: "A step-by-step walkthrough of Nepdora's AI website wizard - from template to live site in minutes.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=70",
    alt: "AI website builder guide",
  },
];

export const CityResources: React.FC = () => {
  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-0">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Guides &amp; resources
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Practical knowledge to help you grow your business online in Nepal.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {resources.map((r, i) => (
            <article
              key={i}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={r.image}
                  alt={r.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                  {r.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {r.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
