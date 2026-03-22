import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  return (
    <section className=" py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem
            value="faq-1"
            className="rounded-2xl border bg-white px-6"
          >
            <AccordionTrigger className="py-6 text-lg font-semibold hover:no-underline">
              How much does a website developer cost in Nepal?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-slate-600">
              The average website developer in Nepal charges between Rs. 30,000
              to Rs. 2,00,000+ depending on complexity. With Nepdora, you can
              skip the high upfront costs and start from as low as Rs.
              999/month.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="faq-2"
            className="rounded-2xl border bg-white px-6"
          >
            <AccordionTrigger className="py-6 text-lg font-semibold hover:no-underline">
              How long does it take to build a website in Nepal?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-slate-600">
              Wait times for traditional developers can range from 4 to 12
              weeks. With Nepdora, our AI-powered platform lets you pick a
              template and launch your site in under 30 minutes.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="faq-3"
            className="rounded-2xl border bg-white px-6"
          >
            <AccordionTrigger className="py-6 text-lg font-semibold hover:no-underline">
              Can I build my own website without a developer in Nepal?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-slate-600">
              Absolutely! Nepdora was built specifically for that. Our visual
              drag-and-drop editor means you don&apos;t need to know a single
              line of code to create a professional, stunning website.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="faq-4"
            className="rounded-2xl border bg-white px-6"
          >
            <AccordionTrigger className="py-6 text-lg font-semibold hover:no-underline">
              Is Nepdora better than hiring a developer?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-slate-600">
              While developers can offer bespoke coding, most Nepali businesses
              need speed, affordability, and the ability to update their site
              themselves. Nepdora provides all of that, plus built-in SEO and
              localized payment support, at a fraction of the cost.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="faq-5"
            className="rounded-2xl border bg-white px-6"
          >
            <AccordionTrigger className="py-6 text-lg font-semibold hover:no-underline">
              Does Nepdora support eSewa and Khalti payments?
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-slate-600">
              Yes! We understand the importance of local payments. Nepdora comes
              with built-in integrations for eSewa, Khalti, and Fonepay, so you
              can start selling to customers across Nepal immediately.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
