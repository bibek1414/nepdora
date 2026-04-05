const faqs = [
  {
    question: "Can I build a website without coding knowledge in Nepal?",
    answer:
      "Yes - Nepdora is designed for non-technical business owners. You use a simple drag-and-drop editor to add your text, images, and products. No HTML, CSS, or coding skills are needed at any step.",
  },
  {
    question: "Which payment gateways work in Nepal for online stores?",
    answer:
      "Nepdora supports eSewa and Khalti - Nepal's most widely used digital payment platforms. You can connect your merchant account in minutes and start accepting payments from customers across Nepal.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "Most Nepdora users publish their first website within 2 hours. You choose a template, fill in your business details, and go live - all on the same day. No waiting for a developer or agency.",
  },
  {
    question: "Do I need technical knowledge to manage my website?",
    answer:
      "No technical knowledge is required. Nepdora's dashboard lets you update text, add products, manage orders, and view analytics through a simple interface - the same way you use a smartphone app.",
  },
  {
    question: "Is my website mobile-friendly automatically?",
    answer:
      "Yes. Every Nepdora website is mobile-first by default. With over 90% of Nepal browsing on smartphones, all templates are fully responsive and load quickly on mobile data connections.",
  },
  {
    question: "How much does it cost to build a website in Nepal with Nepdora?",
    answer:
      "Nepdora has a free plan with basic features and a Business plan at NPR 10,000/year (about NPR 833/month). The Business plan includes one professional website, custom domain, eSewa & Khalti payments, mobile-responsive design, built-in SEO tools, and priority support. No credit card required to start.",
  },
  {
    question: "Can I use my own domain name (e.g. mybusiness.com.np)?",
    answer:
      "Yes. You can connect an existing domain or register a new .com, .com.np, or .np domain directly through Nepdora. Free SSL is included for all custom domains.",
  },
  {
    question: "Is Nepdora only for businesses in Kathmandu?",
    answer:
      "Nepdora is available for businesses across all of Nepal - Kathmandu, Pokhara, Biratnagar, Butwal, Chitwan, and everywhere else. Your website reaches customers nationwide and globally.",
  },
  {
    question: "What types of businesses use Nepdora in Nepal?",
    answer:
      "Restaurants, hotels, homestays, salons, retail shops, clothing brands, service businesses, freelancers, consultants, NGOs, clinics, and gyms - Nepdora works for any Nepali business that wants a professional online presence.",
  },
  {
    question: "Can I switch plans as my business grows?",
    answer:
      "Yes. You can upgrade or downgrade your Nepdora plan at any time. Start with the Starter plan and move to Business or Ecommerce as your needs grow - your website and data carry over seamlessly.",
  },
];

export function HomeFAQSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-0">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Everything you need to know about building a website in Nepal with
            Nepdora.
          </p>
        </div>

        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {faqs.map((faq, i) => (
            <details key={i} className="group px-5 py-4 sm:px-6 sm:py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                  {faq.question}
                </h3>
                <span className="ml-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
