"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
interface GeneratedName {
  name: string;
  tagline: string;
  style: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const INDUSTRIES = [
  "E-commerce & Retail",
  "Technology & SaaS",
  "Health & Wellness",
  "Food & Beverage",
  "Finance & Fintech",
  "Creative & Design",
  "Education & Coaching",
  "Real Estate",
  "Travel & Hospitality",
  "Consulting & Services",
];

const STYLES = [
  "Catchy & playful",
  "Professional & trustworthy",
  "Modern & tech-forward",
  "Natural & organic",
  "Bold & powerful",
  "Elegant & minimal",
];

const FALLBACK: GeneratedName[] = [
  {
    name: "Vexora",
    tagline: "Bold ventures, limitless horizons",
    style: "Modern",
  },
  {
    name: "Nimble & Co.",
    tagline: "Fast, smart, always ahead",
    style: "Professional",
  },
  {
    name: "Foundry Labs",
    tagline: "Where great ideas take shape",
    style: "Tech",
  },
  {
    name: "Bloom Studio",
    tagline: "Growth through creativity",
    style: "Creative",
  },
  {
    name: "Kove",
    tagline: "Simple, powerful, unforgettable",
    style: "Minimal",
  },
  {
    name: "Meridian",
    tagline: "Setting your business direction",
    style: "Corporate",
  },
  {
    name: "Sprout Works",
    tagline: "Small roots, big ambitions",
    style: "Natural",
  },
  {
    name: "Quill & Spark",
    tagline: "Ignite your brand story",
    style: "Creative",
  },
];

// ── Components ──────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex translate-y-px items-center gap-1.5">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className="h-1.5 w-1.5 rounded-full bg-white"
        />
      ))}
    </div>
  );
}

function NameCard({ item, index }: { item: GeneratedName; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.name).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      onClick={handleCopy}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-200",
        copied
          ? "border-primary/40 bg-primary/5"
          : "border-slate-100 bg-white hover:border-slate-200"
      )}
    >
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-primary absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold"
          >
            Copied <Check className="h-3 w-3" />
          </motion.span>
        )}
      </AnimatePresence>
      <div className="mb-1 text-lg font-bold text-slate-900 md:text-xl">
        {item.name}
      </div>
      <div className="mb-3 text-[13px] leading-relaxed text-slate-500">
        {item.tagline}
      </div>
      <span className="bg-primary/10 text-primary inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold">
        {item.style}
      </span>
    </motion.div>
  );
}

export function BusinessNameGeneratorClient() {
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [namingStyle, setNamingStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState<GeneratedName[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setNames([]);

    // simulate generation
    await new Promise(r => setTimeout(r, 1500));
    setNames(FALLBACK);

    setLoading(false);
    setTimeout(
      () =>
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      100
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-[2.5rem] border border-slate-200/60 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-10">
        <div className="mb-6 space-y-2 text-left">
          <label className="text-sm font-semibold text-slate-600">
            What does your business do?
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. eco-friendly pet food subscription for health-conscious dog owners"
            className="focus:border-primary focus:ring-primary/10 h-24 w-full resize-none rounded-2xl border border-slate-200 bg-[#fdfdfd] p-4 text-base transition-all outline-none focus:ring-4"
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                generate();
              }
            }}
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 text-left md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">
              Industry
            </label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-[#fdfdfd] font-medium">
                <SelectValue placeholder="Any industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any industry</SelectItem>
                {INDUSTRIES.map(i => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">
              Naming style
            </label>
            <Select value={namingStyle} onValueChange={setNamingStyle}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-[#fdfdfd] font-medium">
                <SelectValue placeholder="Any style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any style</SelectItem>
                {STYLES.map(s => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={generate}
          disabled={loading || !description.trim()}
          className="bg-primary shadow-primary/20 h-14 w-full rounded-2xl text-base font-bold shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Spinner /> <span>Generating names…</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {names.length > 0 ? "Regenerate names" : "Generate names"}
            </div>
          )}
        </Button>

        {/* Results Section */}
        <AnimatePresence>
          {names.length > 0 && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-10 overflow-hidden border-t border-slate-100 pt-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  {names.length} Names Generated
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Click to copy
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {names.map((n, i) => (
                  <NameCard key={i} item={n} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
