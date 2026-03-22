import React from "react";
import {
  ShoppingBag,
  Hotel,
  Landmark,
  Briefcase,
  Building2,
  GraduationCap,
  Mountain,
} from "lucide-react";

const WhoItsBuiltFor: React.FC = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Who it&apos;s built for
          </h2>
          <p className="mt-4 text-slate-600">
            Tailored solutions for every type of organization in Nepal.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "Restaurants", icon: ShoppingBag },
            { name: "Hotels", icon: Hotel },
            { name: "NGOs", icon: Landmark },
            { name: "Freelancers", icon: Briefcase },
            { name: "Retailers", icon: Building2 },
            { name: "Schools", icon: GraduationCap },
            { name: "Trekking agencies", icon: Mountain },
          ].map(item => (
            <div
              key={item.name}
              className="border-primary/20 flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center transition-all"
            >
              <div className="group-hover:bg-primary/10 group-hover:text-primary mb-4 rounded-full bg-slate-50 p-4 text-slate-600 transition-colors">
                <item.icon className="h-8 w-8" />
              </div>
              <span className="font-semibold text-slate-900">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsBuiltFor;
