import React from "react";
import { Button } from "@/components/ui/button";

const AboutTeam: React.FC = () => {
  return (
    <section className="mx-auto mb-16 border-t border-slate-100 px-4 pt-12 sm:mb-20 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-20">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end sm:gap-8">
        <div>
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Real people. Real support.
          </h2>
          <p className="max-w-lg text-sm text-slate-500 sm:text-base">
            We don't hide behind chatbots. We work out of Jhamsikhel. Come say
            hi.
          </p>
        </div>
        <Button variant="outline" size="sm" className="sm:size-default">
          Join the Team
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-4">
        {[
          {
            name: "Sushil Sharma",
            role: "CEO",
            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Priya KC",
            role: "Product",
            img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
          },
          {
            name: "Amit Pradhan",
            role: "Tech Lead",
            img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
          },
          {
            name: "Sita Gurung",
            role: "Customer Success",
            img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
          },
        ].map((member, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-slate-100 grayscale transition-all duration-500 group-hover:grayscale-0 sm:mb-4 sm:rounded-2xl">
              <img
                src={member.img}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
              {member.name}
            </h3>
            <p className="text-xs text-slate-400 sm:text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutTeam;
