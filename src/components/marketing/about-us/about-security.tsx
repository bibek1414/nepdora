"use client";
import React from "react";
import { ShieldCheck, Lock, Server, Globe } from "lucide-react";
import { motion } from "framer-motion";

const AboutSecurity: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Encrypted to the Core",
      description:
        "Every Nepdora site comes with automatic SSL certificates. Your customer's data is encrypted from the moment they land on your page.",
      delay: 0,
    },
    {
      icon: Server,
      title: "99.9% Uptime",
      description:
        "Our distributed cloud infrastructure ensures your shop is open 24/7, even during peak festivals like Dashain or Tihar.",
      delay: 0.1,
    },
    {
      icon: Globe,
      title: "Local Speed CDNs",
      description:
        "Content delivered via CDNs optimized for South Asia, ensuring instant loading for customers across all of Nepal.",
      delay: 0.2,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 border border-slate-100">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                Bank-Grade Security
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Your business is <span className="text-indigo-600">secure</span> with us.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500"
          >
            Trust is our currency. We treat your data, your customers, and 
            your uptime with absolute technical discipline.
          </motion.p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {securityFeatures.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                className="group relative rounded-2xl border border-slate-100 bg-white p-8 transition-all hover:shadow-lg"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSecurity;
