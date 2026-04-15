"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Calendar,
  Building2,
  Activity,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { checkDomainAvailability, type WhoisData } from "./actions";

export default function DomainNameCheckerClient() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhoisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Small delay for animation feel
      const data = await checkDomainAvailability(domain.trim());
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.domain) return;
    navigator.clipboard.writeText(result.domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Search Bar section */}
      <section className="relative z-10">
        <form
          onSubmit={handleSearch}
          className="group hover:border-primary/30 focus-within:ring-primary/5 relative flex items-center space-x-2 rounded-[2rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/50 transition-all focus-within:ring-8"
        >
          <div className="flex flex-1 items-center px-4">
            <div className="group-focus-within:bg-primary/10 group-focus-within:text-primary flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all">
              <Globe className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value.toLowerCase())}
              placeholder="Enter domain (e.g. nepdora.com or mybusiness.com.np)"
              className="w-full border-none bg-transparent px-3 py-4 text-lg font-bold tracking-tight text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !domain.trim()}
            className="h-14 rounded-full bg-slate-900 px-8 text-base font-black tracking-wider uppercase shadow-xl transition-all hover:bg-slate-800 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Checking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find Domain
              </span>
            )}
          </Button>
        </form>

        <p className="mt-4 px-6 text-center text-sm font-medium text-slate-500">
          💡 Tip: .com.np domains are{" "}
          <span className="font-bold text-emerald-600">100% Free</span> for
          Nepali Citizens and Businesses.
        </p>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-xl"
          >
            <div className="bg-primary/5 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
            </div>
            <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900">
              Checking Availability...
            </h3>
            <p className="font-medium text-slate-500">
              I&apos;m currently scanning global and local registries for you.
            </p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] border border-red-100 bg-red-50 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-black text-red-900">
              Oops! Something went wrong
            </h3>
            <p className="mb-8 font-medium text-red-700/70">{error}</p>
            <Button
              variant="outline"
              className="rounded-full border-red-200 px-8 text-xs font-bold tracking-wider text-red-600 uppercase hover:bg-red-100"
              onClick={() => setError(null)}
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* High-Impact Result Card */}
            <div
              className={cn(
                "rounded-[3rem] border p-1 shadow-2xl transition-all",
                result.registered === false
                  ? "border-emerald-100 bg-emerald-50 shadow-emerald-200/20"
                  : "border-slate-200 bg-slate-50 shadow-slate-200/20"
              )}
            >
              <div className="rounded-[2.8rem] bg-white p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  {/* Status Pill */}
                  <div
                    className={cn(
                      "mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase",
                      result.registered === false
                        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    )}
                  >
                    {result.registered === false ? "Available" : "Registered"}
                  </div>

                  <div className="relative mb-6">
                    <h2 className="text-4xl font-black tracking-tighter break-all text-slate-900 md:text-6xl">
                      {result.domain}
                    </h2>
                    <button
                      onClick={handleCopy}
                      className="absolute top-1/2 -right-10 -translate-y-1/2 rounded-full p-2 text-slate-300 transition-all hover:bg-slate-50 hover:text-slate-900 md:-right-12"
                      title="Copy domain name"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p
                    className={cn(
                      "mb-10 max-w-md text-lg leading-relaxed font-medium",
                      result.registered === false
                        ? "text-emerald-700/70"
                        : "text-slate-500"
                    )}
                  >
                    {result.registered === false
                      ? "Great news! This domain is available. You can register it and start building your brand today."
                      : `The domain ${result.domain} is already registered. Try searching for a different suffix or variation.`}
                  </p>

                  <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                    {result.registered === false ? (
                      <Link href="/admin/signup" className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className="h-16 w-full rounded-[2rem] bg-slate-900 px-12 text-lg font-black tracking-tight text-white uppercase shadow-2xl transition-all hover:scale-105 hover:bg-slate-800"
                        >
                          Secure Domain
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => setResult(null)}
                        variant="outline"
                        size="lg"
                        className="h-16 w-full rounded-[2rem] border-slate-200 px-12 font-black tracking-tight text-slate-900 uppercase hover:bg-slate-50 sm:w-auto"
                      >
                        Search Another
                      </Button>
                    )}
                  </div>

                  {result.isDemo && (
                    <div className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                      <Info className="h-3 w-3" />
                      Preview Mode: Connect your API key for live data.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Simple Bot Advice */}
            {result.registered === false && result.domain?.endsWith(".np") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4 rounded-[2rem] border border-indigo-100 bg-indigo-50 p-8"
              >
                <div className="mt-1 flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
                    NP
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 leading-tight font-black text-indigo-900">
                    Bot Tip: Get this for free!
                  </h4>
                  <p className="text-sm leading-relaxed font-medium text-indigo-700/70">
                    I noticed you&apos;re looking at a .np domain. Nepdora can
                    help you register this for zero cost and connect it to your
                    website automatically.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Benefits Section */}
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              title: "AI-Powered Analysis",
              desc: "I check availability across 500+ global registries in real-time.",
              icon: Search,
            },
            {
              title: "Local Specialists",
              desc: "Full support for .com.np and other Nepal-specific extensions.",
              icon: Globe,
            },
            {
              title: "Auto-Integration",
              desc: "Once found, I can connect your domain to Nepdora in one click.",
              icon: Activity,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="group-hover:bg-primary mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 transition-all group-hover:text-white">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
