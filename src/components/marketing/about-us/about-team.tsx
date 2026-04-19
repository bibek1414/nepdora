import React from "react";
import { Button } from "@/components/ui/button";

const AboutTeam: React.FC = () => {
  const teamMembers = [
    {
      name: "Sushil Sharma",
      role: "CEO & Founder",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Priya KC",
      role: "Head of Product",
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    },
    {
      name: "Amit Pradhan",
      role: "Engineering Lead",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Sita Gurung",
      role: "Customer Success",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Real people. Real support.
            </h2>
            <p className="max-w-lg text-lg text-slate-500">
              We don't hide behind chatbots. Our team works right here in 
              Kathmandu to help you scale.
            </p>
          </div>
          <Button variant="outline" className="rounded-xl border-slate-200 px-8 py-6 text-base font-semibold transition hover:bg-slate-50">
            Join our team
          </Button>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="group">
              <div className="mb-4 overflow-hidden rounded-2xl bg-slate-100">
                <img 
                  src={member.img} 
                  alt={member.name}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-sm font-medium text-indigo-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;
