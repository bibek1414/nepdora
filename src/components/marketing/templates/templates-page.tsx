"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateCard } from "./template-card";
import { CategoryNavigation } from "./category-navigation";
import { Template, Category, CategoryKey, TemplateCategories } from "./types";

const TemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryKey>("portfolio");

  const categories: Category[] = [
    { key: "portfolio", label: "Portfolio" },
    { key: "business", label: "Business showcase" },
    { key: "ecommerce", label: "Online store" },
    { key: "blog", label: "Blog" },
    { key: "other", label: "Other" },
  ];

  const templateCategories: TemplateCategories = {
    portfolio: [
      {
        id: 1,
        name: "Creative Portfolio",
        description: "Perfect for photographers and artists",
        image: "/images/templates/template1.avif",
        featured: true,
      },
      {
        id: 2,
        name: "Minimal Portfolio",
        description: "Clean and professional design",
        image: "/images/templates/template2.avif",
      },
      {
        id: 3,
        name: "Photography Showcase",
        description: "Stunning visual presentations",
        image: "/images/templates/template3.avif",
      },
      {
        id: 4,
        name: "Designer Portfolio",
        description: "Modern and interactive layout",
        image: "/images/templates/template4.avif",
        featured: true,
      },
    ],
    business: [
      {
        id: 5,
        name: "Corporate Website",
        description: "Professional business presence",
        image: "/images/templates/template5.avif",
      },
      {
        id: 6,
        name: "Startup Landing",
        description: "Perfect for new ventures",
        image: "/images/templates/template6.avif",
        featured: true,
      },
      {
        id: 7,
        name: "Agency Showcase",
        description: "Creative agency template",
        image: "/images/templates/template7.avif",
      },
      {
        id: 8,
        name: "Consulting Firm",
        description: "Professional services layout",
        image: "/images/templates/template8.avif",
      },
    ],
    ecommerce: [
      {
        id: 9,
        name: "Fashion Store",
        description: "Trendy online boutique",
        image: "/images/templates/template9.avif",
        featured: true,
      },
      {
        id: 10,
        name: "Electronics Shop",
        description: "Modern tech store design",
        image: "/images/templates/template10.avif",
      },
      {
        id: 11,
        name: "Marketplace",
        description: "Multi-vendor platform",
        image: "/images/templates/template11.avif",
      },
      {
        id: 12,
        name: "Minimalist Store",
        description: "Clean shopping experience",
        image: "/images/templates/template12.avif",
      },
    ],
    blog: [
      {
        id: 13,
        name: "Personal Blog",
        description: "Share your thoughts and stories",
        image: "/images/templates/template13.avif",
      },
      {
        id: 14,
        name: "Magazine Style",
        description: "Professional publishing layout",
        image: "/images/templates/template14.avif",
        featured: true,
      },
      {
        id: 15,
        name: "Tech Blog",
        description: "Perfect for developers",
        image: "/images/templates/template15.avif",
      },
      {
        id: 16,
        name: "Lifestyle Blog",
        description: "Beautiful content presentation",
        image: "/images/templates/template16.avif",
      },
    ],
    other: [
      {
        id: 17,
        name: "Event Landing",
        description: "Perfect for conferences and events",
        image: "/images/templates/template17.avif",
      },
      {
        id: 18,
        name: "Restaurant Menu",
        description: "Elegant dining experience",
        image: "/images/templates/template18.avif",
        featured: true,
      },
      {
        id: 19,
        name: "Fitness Studio",
        description: "Health and wellness focused",
        image: "/images/templates/template19.avif",
      },
      {
        id: 20,
        name: "Music Artist",
        description: "Perfect for musicians and bands",
        image: "/images/templates/template20.avif",
      },
    ],
  };

  // Type-safe way to access templates
  const currentTemplates: Template[] =
    templateCategories[selectedCategory] || [];

  const handleCategoryChange = (category: CategoryKey) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h1 className="text-foreground mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Choose a website template that inspires you
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-4xl text-lg md:text-xl">
            Take advantage of 150+ responsive, designer-made templates, suitable
            for businesses, ecommerce stores, portfolios, landing pages, blogs,
            and more.
          </p>
          <Button size="lg" className="rounded-full px-8">
            Get started
          </Button>
        </div>

        {/* Category Navigation */}
        <CategoryNavigation
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentTemplates.map((template: Template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {/* Bottom Line Separator */}
        <div className="mt-16 mb-8">
          <div className="via-border h-px bg-gradient-to-r from-transparent to-transparent"></div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-foreground mb-4 text-2xl font-bold md:text-3xl">
            Can&apos;t find the perfect template?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
            Start with a blank canvas and create something unique, or contact
            our design team for a custom solution tailored to your needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="outline" size="lg" className="rounded-full px-8">
              Start from scratch
            </Button>
            <Button variant="default" size="lg" className="rounded-full px-8">
              Contact design team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
