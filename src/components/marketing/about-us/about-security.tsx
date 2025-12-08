import React from "react";
import { ShieldCheck, Lock, Server, Globe } from "lucide-react";

const AboutSecurity: React.FC = () => {
  return (
    <section className="relative mx-4 mb-16 overflow-hidden rounded-2xl bg-slate-900 py-16 text-white sm:mb-32 sm:rounded-3xl sm:py-20 md:mx-6 md:rounded-[3rem] md:py-32 lg:mx-auto lg:max-w-6xl lg:px-20">
      <div className="bg-primary/20 pointer-events-none absolute top-0 right-0 h-[300px] w-[300px] rounded-full blur-[120px] sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-20">
          <div className="text-primary mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
            <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-xs font-bold tracking-widest uppercase sm:text-sm">
              Bank-Grade Security
            </span>
          </div>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl lg:text-6xl">
            Your business is safe with us.
          </h2>
          <p className="max-w-2xl text-sm font-light text-slate-400 sm:text-base md:text-lg lg:text-xl">
            In a digital world, trust is currency. We treat your data, your
            customers, and your uptime with military-grade discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-slate-800 pt-8 sm:gap-10 sm:pt-10 md:grid-cols-3 md:gap-12 md:pt-12">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 sm:h-12 sm:w-12">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold sm:text-xl">
              SSL Encryption
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              Every Nepdora site comes with automatic SSL certificates. Your
              customer's data is encrypted from the moment they land on your
              page.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 sm:h-12 sm:w-12">
              <Server className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold sm:text-xl">99.9% Uptime</h3>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              Our distributed cloud infrastructure ensures your shop is open
              24/7, even during high traffic festivals like Dashain or Tihar.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 sm:h-12 sm:w-12">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold sm:text-xl">
              Local Data Centers
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 sm:text-sm">
              Content delivered via CDNs optimized for South Asia, meaning your
              site loads instantly for customers in Kathmandu, Pokhara, and
              beyond.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSecurity;
