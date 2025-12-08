import React from "react";
import { Heart, Users } from "lucide-react";

const AboutValues: React.FC = () => {
  return (
    <section className="mx-auto mb-16 px-4 sm:mb-32 sm:px-6 lg:max-w-7xl lg:px-20">
      <div className="flex flex-col items-center gap-8 md:flex-row md:gap-16">
        <div className="order-2 flex-1 md:order-1">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <img
              src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
              className="h-48 w-full rounded-xl object-cover transition-transform duration-700 hover:scale-105 sm:h-56 md:h-64 md:rounded-2xl"
              alt="Local artisan"
            />
            <img
              src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?q=80&w=600&auto=format&fit=crop"
              className="mt-8 h-48 w-full rounded-xl object-cover transition-transform duration-700 hover:scale-105 sm:mt-12 sm:h-56 md:mt-12 md:h-64 md:rounded-2xl"
              alt="Coding"
            />
          </div>
        </div>
        <div className="order-1 flex-1 md:order-2">
          <h2 className="mb-6 text-2xl leading-tight font-bold text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
            Building with Nepdora is a statement.
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-relaxed md:text-lg">
            When you build here, you aren't just making a website. You are
            joining a movement of 15,000+ Nepali founders claiming their space
            on the internet.
          </p>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-relaxed md:text-lg">
            We want you to be proud. Proud that your site is world-class. Proud
            that it loads fast. Proud that it's built on technology made right
            here at home.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
            <div className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" />{" "}
              Supports Local Economy
            </div>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" /> Community First
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
