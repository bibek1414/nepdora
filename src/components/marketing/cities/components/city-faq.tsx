const faqItems = [
  {
    question: "What is Nepdora?",
    answer:
      "Nepdora is Nepal's all-in-one business platform. It lets you build a professional website, accept eSewa and Khalti payments, manage orders, and track analytics — all from one dashboard, with no coding required.",
  },
  {
    question: "How does Nepdora optimise for Nepal's local market?",
    answer:
      "We integrate directly with eSewa and Khalti, generate SEO meta tags and schema markup automatically for Nepali search queries, and offer support in both Nepali and English so your business grows locally from day one.",
  },
  {
    question: "How quickly can I launch my website?",
    answer:
      "Most businesses go live in under 10 minutes. Choose a template, add your content, connect your payment gateway, and publish. Our AI wizard guides you through every step.",
  },
];

export const CityFAQ: React.FC = () => {
  return (
    <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-base leading-relaxed text-slate-500">
            Everything you need to know before getting started.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white px-7 py-6"
            >
              <h3 className="mb-2.5 text-base font-semibold text-slate-900">
                {item.question}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
