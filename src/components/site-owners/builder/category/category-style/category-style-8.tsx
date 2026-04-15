"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, FolderOpen } from "lucide-react";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Category } from "@/types/owner-site/admin/product";
import { CategoryCard8 } from "../category-card/category-card-8";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface CategoryStyleProps {
  data: CategoryComponentData["data"];
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<CategoryComponentData["data"]>) => void;
  onCategoryClick?: (categoryId: number) => void;
}

export const CategoryStyle8: React.FC<CategoryStyleProps> = ({
  data,
  isEditable = false,
  siteUser,
  onUpdate,
  onCategoryClick,
}) => {
  const {
    title = "Build Your Perfect Skincare Routine",
    subtitle:
      description = "Answer a few questions about your skin type and concerns, and we'll create a personalized routine just for you.",
    featuredContent,
    stats = [
      { label: "Routines Created", value: "10K+" },
      { label: "Satisfaction Rate", value: "96%" },
    ],
  } = data || {};
  const { data: categoriesData, isLoading } = useCategories();
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
      accent: "#3B82F6",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const colors = theme.colors as any;
  const fonts = theme.fonts;

  const categories = categoriesData?.results || [];

  // Take first 5 categories as routine steps if available
  const steps = categories.slice(0, 5).map((cat: Category, index: number) => ({
    step: index + 1,
    id: cat.id,
    name: cat.name,
    image: cat.image,
    description: cat.description || "Personalized care",
    slug: cat.slug,
  }));

  const handleTitleChange = (newTitle: string) => {
    onUpdate?.({ title: newTitle });
  };

  const handleDescriptionChange = (newDescription: string) => {
    onUpdate?.({ subtitle: newDescription });
  };

  const handleLinkChange = (text: string, href: string) => {
    onUpdate?.({
      featuredContent: {
        ...featuredContent,
        buttonText: text,
        buttonHref: href,
      },
    });
  };

  const handleStatChange = (
    index: number,
    field: "label" | "value",
    newValue: string
  ) => {
    const newStats = [...(stats || [])];
    if (!newStats[index]) {
      newStats[index] = { label: "", value: "" };
    }
    newStats[index] = { ...newStats[index], [field]: newValue };
    onUpdate?.({ stats: newStats });
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute -top-8 -right-8 -z-10 h-64 w-64 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 -z-10 h-64 w-64 rounded-full opacity-20 blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <EditableText
                value={title}
                onChange={handleTitleChange}
                as="h2"
                className="text-3xl font-bold md:text-5xl lg:text-6xl"
                isEditable={isEditable}
                placeholder="Enter title..."
                multiline
              />

              <EditableText
                value={description || ""}
                onChange={handleDescriptionChange}
                as="p"
                className="text-muted-foreground max-w-md text-lg opacity-90"
                isEditable={isEditable}
                placeholder="Enter description..."
                multiline={true}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <EditableLink
                text={featuredContent?.buttonText || "Start Your Routine"}
                href={featuredContent?.buttonHref || "/routine-builder"}
                onChange={handleLinkChange}
                isEditable={isEditable}
                siteUser={siteUser}
                className="group inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.primaryForeground,
                  fontFamily: fonts.heading,
                }}
              >
                <div className="flex items-center gap-2">
                  {featuredContent?.buttonText || "Start Your Routine"}
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </EditableLink>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 py-8">
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  <div>
                    <EditableText
                      value={stat.value}
                      onChange={val => handleStatChange(index, "value", val)}
                      className="text-3xl font-bold"
                      isEditable={isEditable}
                      placeholder="Value"
                    />
                    <EditableText
                      value={stat.label}
                      onChange={val => handleStatChange(index, "label", val)}
                      className="text-muted-foreground text-sm"
                      isEditable={isEditable}
                      placeholder="Label"
                    />
                  </div>
                  {index < stats.length - 1 && (
                    <div className="bg-border/50 h-10 w-px" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Right - Steps Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2
                  className="h-8 w-8 animate-spin"
                  style={{ color: colors.primary }}
                />
              </div>
            ) : steps.length > 0 ? (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <CategoryCard8
                    key={step.id}
                    category={step as any}
                    stepNumber={step.step}
                    isEditable={isEditable}
                    siteUser={siteUser}
                    onClick={onCategoryClick}
                  />
                ))}
              </div>
            ) : (
              <BuilderEmptyState
                icon={FolderOpen}
                title="No Categories Found"
                description="Organize your content by adding categories from the admin dashboard."
                actionLabel="Manage Categories"
                actionLink="/admin/categories"
                isEditable={isEditable}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
