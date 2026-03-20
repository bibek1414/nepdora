import React from "react";
import { ContactForm } from "./contact-form";
import { ContactAnimations } from "./contact-animations";

export default function ContactUs() {
  return (
    <ContactAnimations>
      <div className="pointer-events-none absolute top-40 -left-20 z-10 hidden h-60 w-60 rounded-full bg-blue-500 opacity-10 blur-3xl md:block"></div>
      <div className="bg-primary pointer-events-none absolute -right-20 bottom-40 z-10 hidden h-60 w-60 rounded-full opacity-10 blur-3xl md:block"></div>

      <div className="relative z-20 mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          Get In Touch
        </h2>
      </div>

      <ContactForm />
    </ContactAnimations>
  );
}
