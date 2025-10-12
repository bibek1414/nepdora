"use client";
import React, { useState } from "react";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Plus, Minus } from "lucide-react";
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Getting Started",
    question: "What is Nepdora?",
    answer:
      "Nepdora is an online website builder platform that allows you to create professional websites through an intuitive drag-and-drop interface. No coding knowledge required - simply select components, customize them, and build your dream website in minutes.",
  },
  {
    id: "2",
    category: "Features",
    question: "How does the drag-and-drop feature work?",
    answer:
      "Our drag-and-drop builder makes website creation simple. Choose from our library of pre-designed components (headers, footers, galleries, forms, etc.), drag them to your canvas, and drop them where you want. You can then customize colors, text, images, and layouts with just a few clicks.",
  },
  {
    id: "3",
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Click on the 'Sign Up' button in the top right corner of our homepage. Enter your email, create a password, and verify your email address. Once verified, you can start building your website immediately.",
  },
  {
    id: "4",
    category: "Templates",
    question: "Are there pre-built templates available?",
    answer:
      "Yes! Nepdora offers a wide variety of professionally designed templates for different industries including e-commerce, portfolios, blogs, business websites, and more. You can start with a template and customize it to match your brand.",
  },
  {
    id: "5",
    category: "Pricing",
    question: "What are the pricing plans?",
    answer:
      "We offer flexible pricing plans to suit different needs: Free plan for personal projects, Pro plan for professionals, and Business plan for enterprises. Each plan includes different features, storage limits, and custom domain options. Visit our pricing page for detailed information.",
  },
  {
    id: "6",
    category: "Publishing",
    question: "How do I publish my website?",
    answer:
      "Once you're happy with your design, click the 'Publish' button in the top right corner. You can publish to a free Nepdora subdomain or connect your own custom domain. Your website will be live within seconds.",
  },
  {
    id: "7",
    category: "Support",
    question: "Can I get help if I'm stuck?",
    answer:
      "Absolutely! We offer 24/7 customer support through email, live chat, and phone. Our support team is always ready to help you with any questions or issues you encounter while building your website.",
  },
];

const categories = [
  { id: "all", name: "All", icon: "📚" },
  { id: "account", name: "Account", icon: "👤" },
  { id: "features", name: "Features", icon: "⚡" },
  { id: "templates", name: "Templates", icon: "🎨" },
  { id: "pricing", name: "Pricing", icon: "💳" },
  { id: "support", name: "Support", icon: "🛟" },
];

const SupportFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs =
    selectedCategory === "all"
      ? faqData
      : faqData.filter(
          faq => faq.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card className="border-primary gap-0 border-r-2 border-none py-0">
                <CardContent className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`relative flex w-full cursor-pointer items-center gap-3 py-1 pr-6 pl-4 text-left transition-all ${
                        selectedCategory === category.id
                          ? "bg-white font-medium text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </CardContent>
                <div className="px-10 py-6">
                  <div className="text-lg font-semibold text-gray-900">
                    Do you still need help?
                  </div>
                  <span className="text-sm">
                    Always support whenever you need (24/7).
                  </span>
                </div>
                <div className="space-y-3 px-10">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <a href="mailto:nepdora@gmail.com">
                      <Mail className="text-primary h-5 w-5" />
                      <span>Email</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                  >
                    <MessageCircle className="text-primary h-5 w-5" />
                    <span>Chat now</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    asChild
                  >
                    <a href="tel:9860425440">
                      <Phone className="text-primary h-5 w-5" />
                      <span className="text-primary">9860425440</span>
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-gray-600">
                Find answers to common questions about Nepdora
              </p>
            </div>

            {filteredFAQs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map(faq => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="rounded-lg border-b bg-white px-6"
                  >
                    <AccordionTrigger className="group flex items-center justify-between hover:no-underline">
                      <div className="flex flex-col items-start gap-2 text-left">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {faq.question}
                        </h3>
                      </div>
                      {/* Icon changes based on open/closed state */}
                      <span className="ml-2 shrink-0">
                        <Plus className="h-5 w-5 transition-transform group-data-[state=open]:hidden group-data-[state=open]:rotate-0" />
                        <Minus className="hidden h-5 w-5 group-data-[state=open]:block" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">
                    No FAQs found for this category.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportFAQ;
