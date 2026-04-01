"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { OthersTemplate17Data } from "@/types/owner-site/components/others";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { cn } from "@/lib/utils";

interface OthersTemplate17Props {
  othersData: OthersTemplate17Data;
  isEditable?: boolean;
  onUpdate?: (updatedData: Partial<OthersTemplate17Data>) => void;
}

export const OthersTemplate17: React.FC<OthersTemplate17Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme =
    themeResponse?.data?.[0]?.data?.theme ||
    ({
      colors: {
        background: "#FFFFFF",
        primary: "#000000",
        primaryForeground: "#FFFFFF",
        secondary: "#f0f4e4",
        text: "#1a1a1a",
      },
      fonts: { heading: "sans-serif", body: "sans-serif" },
    } as any);

  const { data, handleTextUpdate, handleArrayItemUpdate } = useBuilderLogic(
    othersData,
    onUpdate
  );

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const steps = data.steps || [];
  const step = steps[current];

  const goNext = () => {
    if (steps.length <= 1) return;
    setDirection(1);
    setCurrent(prev => (prev + 1) % steps.length);
  };

  const goPrev = () => {
    if (steps.length <= 1) return;
    setDirection(-1);
    setCurrent(prev => (prev - 1 + steps.length) % steps.length);
  };

  if (!step) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          {/* Badge + Heading */}
          <div className="space-y-6">
            <div className="flex w-fit items-center gap-2 rounded-full bg-gray-200 px-4 py-1.5 text-sm font-medium">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <EditableText
                as="p"
                value={data.badge}
                onChange={handleTextUpdate("badge")}
                isEditable={isEditable}
                className="font-medium"
              />
            </div>
            <EditableText
              as="h1"
              value={data.heading}
              onChange={handleTextUpdate("heading")}
              isEditable={isEditable}
              className="text-4xl leading-tight font-bold tracking-tight text-gray-950 md:text-6xl lg:max-w-[600px]"
              style={{ fontFamily: theme.fonts.heading }}
              multiline
            />
          </div>

          {/* Step Navigation Row */}
          <div className="mt-16 flex items-center gap-8 md:mt-24">
            <div className="relative h-10 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={{
                    enter: d => ({ y: d > 0 ? 30 : -30, opacity: 0 }),
                    center: { y: 0, opacity: 1 },
                    exit: d => ({ y: d > 0 ? -30 : 30, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 flex items-center gap-6"
                >
                  <EditableText
                    as="h3"
                    value={step.title}
                    onChange={(val: string) =>
                      handleArrayItemUpdate("steps", step.id)({ title: val })
                    }
                    isEditable={isEditable}
                    className="text-xl font-semibold whitespace-nowrap text-gray-950"
                  />
                  <div className="h-px flex-1 bg-gray-200" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                onClick={goPrev}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-200 text-gray-950 transition-all hover:bg-gray-50 active:scale-95 md:h-14 md:w-14"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goNext}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white transition-all hover:opacity-90 active:scale-95 md:h-14 md:w-14"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="relative mt-10 h-[400px] overflow-hidden rounded-[32px] border border-gray-100 bg-gray-50 md:mt-12 md:h-[320px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={{
                  enter: d => ({ x: d > 0 ? "100%" : "-100%" }),
                  center: { x: 0 },
                  exit: d => ({ x: d > 0 ? "-100%" : "100%" }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-between p-8 md:flex-row md:p-10"
              >
                <div className="flex h-full w-full flex-col justify-between space-y-6 md:max-w-[320px] md:space-y-0">
                  <EditableText
                    as="p"
                    value={step.description}
                    onChange={(val: string) =>
                      handleArrayItemUpdate(
                        "steps",
                        step.id
                      )({
                        description: val,
                      })
                    }
                    isEditable={isEditable}
                    className="text-lg leading-relaxed text-gray-600"
                  />
                  <EditableLink
                    text={step.buttonText}
                    href={step.buttonLink}
                    onChange={(text: string, href: string) =>
                      handleArrayItemUpdate(
                        "steps",
                        step.id
                      )({
                        buttonText: text,
                        buttonLink: href,
                      })
                    }
                    isEditable={isEditable}
                    className="flex w-fit items-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-all hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.primaryForeground,
                    }}
                  >
                    <span>{step.buttonText}</span>
                    <ArrowUpRight size={18} />
                  </EditableLink>
                </div>
                <div className="hidden aspect-square h-full overflow-hidden rounded-[24px] md:block">
                  <EditableImage
                    src={step.smallImage.url}
                    alt={step.smallImage.alt}
                    onImageChange={(url: string) =>
                      handleArrayItemUpdate(
                        "steps",
                        step.id
                      )({
                        smallImage: { ...step.smallImage, url },
                      })
                    }
                    isEditable={isEditable}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Large Image */}
        <div className="relative aspect-4/5 w-full overflow-hidden rounded-[40px] bg-gray-100 lg:h-[720px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full"
            >
              <EditableImage
                src={step.bigImage.url}
                alt={step.bigImage.alt}
                onImageChange={url =>
                  handleArrayItemUpdate(
                    "steps",
                    step.id
                  )({
                    bigImage: { ...step.bigImage, url },
                  })
                }
                isEditable={isEditable}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
