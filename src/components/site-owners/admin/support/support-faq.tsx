"use client";
import React, { useState, useMemo } from "react";
import { Mail, MessageCircle, Phone, Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFAQs, useFAQCategories } from "@/hooks/superadmin/use-faq-category";

const SupportFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch FAQs and Categories from API
  const {
    data: faqsData,
    isLoading: faqsLoading,
    error: faqsError,
  } = useFAQs();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useFAQCategories();

  // Process categories for sidebar
  const categories = useMemo(() => {
    const allCategory = { id: "all", name: "All", icon: "📚" };

    if (!categoriesData) return [allCategory];

    const apiCategories = categoriesData.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
    }));

    return [allCategory, ...apiCategories];
  }, [categoriesData]);

  // Filter FAQs based on selected category
  const filteredFAQs = useMemo(() => {
    if (!faqsData) return [];

    if (selectedCategory === "all") {
      return faqsData;
    }

    return faqsData.filter(
      faq => faq.category?.id.toString() === selectedCategory
    );
  }, [faqsData, selectedCategory]);

  // Loading state
  if (faqsLoading || categoriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (faqsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600">
            Failed to load FAQs. Please try again later.
          </p>
        </div>
      </div>
    );
  }

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
                          ? "bg-primary font-medium text-white capitalize"
                          : "text-gray-500 capitalize hover:text-gray-900"
                      }`}
                    >
                      <span>{category.name}</span>
                    </button>
                  ))}
                </CardContent>
                <div className="px-5 py-6">
                  <div className="text-lg font-semibold text-gray-900">
                    Do you still need help?
                  </div>
                  <span className="text-sm">
                    Always support whenever you need (24/7).
                  </span>
                </div>
                <div className="space-y-3 px-5 pb-6">
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
                    value={faq.id.toString()}
                    className="rounded-lg border-b bg-white px-6"
                  >
                    <AccordionTrigger className="group flex items-center justify-between hover:no-underline">
                      <div className="flex flex-col items-start gap-2 text-left">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {faq.question}
                        </h3>
                      </div>
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
