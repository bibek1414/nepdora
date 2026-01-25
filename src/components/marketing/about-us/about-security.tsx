"use client";
import React from "react";
import { ShieldCheck, Lock, Server, Globe } from "lucide-react";
import { motion } from "framer-motion";

const AboutSecurity: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "SSL Encryption",
      description:
        "Every Nepdora site comes with automatic SSL certificates. Your customer's data is encrypted from the moment they land on your page.",
      delay: 0,
    },
    {
      icon: Server,
      title: "99.9% Uptime",
      description:
        "Our distributed cloud infrastructure ensures your shop is open 24/7, even during high traffic festivals like Dashain or Tihar.",
      delay: 0.1,
    },
    {
      icon: Globe,
      title: "Local Data Centers",
      description:
        "Content delivered via CDNs optimized for South Asia, meaning your site loads instantly for customers in Kathmandu, Pokhara, and beyond.",
      delay: 0.2,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Background Decorative Element */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-full w-full -translate-x-1/2 overflow-hidden">
        <div className="bg-secondary/50 absolute top-[-10%] left-[10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
        <div className="bg-primary/5 absolute right-[10%] bottom-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="bg-secondary hover:border-primary/30 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-1.5 shadow-sm transition-all duration-300">
              <ShieldCheck className="text-primary h-4 w-4" />
              <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                Bank-Grade Security
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Your business is <span className="text-primary italic">safe</span>{" "}
            with us.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600"
          >
            In a digital world, trust is currency. We treat your data, your
            customers, and your uptime with military-grade discipline.
          </motion.p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {securityFeatures.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay + 0.3 }}
                className="group relative"
              >
                <div className="bg-secondary group-hover:bg-primary group-hover:shadow-primary/30 mb-8 flex h-14 w-14 items-center justify-center rounded-2xl text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 group-hover:scale-110 group-hover:text-white">
                  <item.icon className="h-7 w-7" />
                </div>

                <h3 className="group-hover:text-primary mb-4 text-2xl leading-7 font-bold text-slate-900 transition-colors duration-300">
                  {item.title}
                </h3>

                <p className="text-lg leading-relaxed text-slate-600">
                  {item.description}
                </p>

                {/* Subtle background accent on hover */}
                <div className="absolute -inset-x-4 -inset-y-6 z-[-1] rounded-3xl bg-slate-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSecurity;
