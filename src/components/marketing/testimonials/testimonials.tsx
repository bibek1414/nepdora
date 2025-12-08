import React from "react";
import { Star } from "lucide-react";

const Reviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      quote:
        "I tried building a site on WordPress and gave up after 2 weeks. With Nepdora, my shop was live in an afternoon.",
      author: "Aarati S.",
      role: "Founder, Aarati Crafts",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    },
    {
      id: 2,
      quote:
        "The automatic logistics integration for Kathmandu valley delivery is a lifesaver. I don't even have to call riders anymore.",
      author: "Bikash M.",
      role: "Owner, TechHub Nepal",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    {
      id: 3,
      quote:
        "My SEO ranking jumped to the first page for 'Trekking Gear' within a month. The AI writes better descriptions than I do.",
      author: "Sita R.",
      role: "Manager, Summit Gears",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-12 md:mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Loved by Nepali Businesses Owners.
          </h2>
          <p className="text-sm text-slate-600 sm:text-base md:text-lg">
            Join 15,000+ Nepali businesses growing online with Nepdora.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {reviews.map(review => (
            <div
              key={review.id}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-6 sm:rounded-2xl sm:p-8"
            >
              <div className="mb-4 flex gap-0.5 text-yellow-400 sm:mb-6 sm:gap-1">
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
                <Star size={14} fill="currentColor" className="sm:h-4 sm:w-4" />
              </div>
              <p className="mb-4 flex-1 text-sm leading-relaxed font-normal text-slate-700 sm:mb-6 sm:text-base">
                "{review.quote}"
              </p>
              <div className="mt-auto flex items-center gap-3 sm:gap-4">
                <img
                  src={review.image}
                  alt={review.author}
                  className="h-9 w-9 rounded-full border border-slate-200 object-cover sm:h-10 sm:w-10"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-900 sm:text-sm">
                    {review.author}
                  </div>
                  <div className="text-[10px] text-slate-500 sm:text-xs">
                    {review.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
