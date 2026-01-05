"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Mail, MessageCircle, Phone, Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFAQs } from "@/hooks/super-admin/use-faq-category";
import { FAQCategory } from "@/types/super-admin/faq-category";

const SupportFAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch FAQs from API
  const {
    data: faqsData,
    isLoading: faqsLoading,
    error: faqsError,
  } = useFAQs();

  // Process categories for sidebar from faqsData
  const categories = useMemo(() => {
    if (!faqsData) return [];

    const uniqueCategories = new Map<number, { id: string; name: string }>();

    faqsData.forEach(faq => {
      if (faq.category) {
        if (!uniqueCategories.has(faq.category.id)) {
          uniqueCategories.set(faq.category.id, {
            id: faq.category.id.toString(),
            name: faq.category.name,
          });
        }
      }
    });

    return Array.from(uniqueCategories.values());
  }, [faqsData]);

  // Set default category to first available category
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // Filter FAQs based on selected category
  const filteredFAQs = useMemo(() => {
    if (!faqsData || !selectedCategory) return [];

    return faqsData.filter(
      faq => faq.category?.id.toString() === selectedCategory
    );
  }, [faqsData, selectedCategory]);

  // Loading state
  const isLoading = faqsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-white">
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
      <div className="flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600">
            Failed to load FAQs. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
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
                      className={`relative flex w-full cursor-pointer items-center gap-3 py-2 pr-6 pl-4 text-left transition-all ${
                        selectedCategory === category.id
                          ? "bg-primary rounded-lg font-medium text-white capitalize"
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
                    <a href="tel:9866316114">
                      <Phone className="text-primary h-5 w-5" />
                      <span className="text-primary">9866316114</span>
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
