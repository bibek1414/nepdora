import React from "react";
import { Layout, MousePointer2, Zap } from "lucide-react";

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 text-black sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-slate-400">
            Launch your professional website in three simple steps.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {[
            {
              title: "Pick a Nepal-made template",
              description:
                "Choose from 200+ templates designed specifically for the Nepali market.",
              icon: Layout,
            },
            {
              title: "Drag, drop, customize — no code",
              description:
                "Use our intuitive visual builder to add your text, images, and brand colors.",
              icon: MousePointer2,
            },
            {
              title: "Publish and go live",
              description:
                "Connect your custom domain and share your website with the world in one click.",
              icon: Zap,
            },
          ].map((step, idx) => (
            <div key={idx} className="relative text-center">
              <div className="text-primary/80 border-primary/30 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border bg-gray-50">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
