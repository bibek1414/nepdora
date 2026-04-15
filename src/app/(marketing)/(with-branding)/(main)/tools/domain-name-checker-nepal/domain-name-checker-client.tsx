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

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Search Bar section */}
      <section className="relative z-10">
        <form
          onSubmit={handleSearch}
          className="group focus-within:ring-primary/10 flex items-center rounded-full border border-slate-200 bg-white p-2 shadow-lg transition-all focus-within:ring-4"
        >
          <div className="flex flex-1 items-center px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400">
              <Globe className="h-5 w-5" />
            </div>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value.toLowerCase())}
              placeholder="Enter domain (e.g. nepdora.com or mybusiness.com.np)"
              className="w-full border-none bg-transparent px-3 py-4 text-base font-medium text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !domain.trim()}
            className="bg-primary h-14 rounded-full px-8 text-base font-semibold shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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
          Tip: .com.np domains are free for Nepali citizens and businesses.
        </p>
      </section>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-md"
          >
            <div className="bg-primary/5 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
              <div className="border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-4" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">
              Checking availability...
            </h3>
            <p className="font-medium text-slate-500">
              Scanning global and local registries for you.
            </p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-red-100 bg-red-50 p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-red-900">
              Something went wrong
            </h3>
            <p className="mb-8 font-medium text-red-700/70">{error}</p>
            <Button
              variant="outline"
              className="rounded-full border-red-200 px-8 font-medium text-red-600 hover:bg-red-100"
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
            {/* Result Card */}
            <div
              className={cn(
                "rounded-3xl border p-1 shadow-lg",
                result.registered === false
                  ? "border-emerald-100 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              )}
            >
              <div className="rounded-3xl bg-white p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  {/* Status Badge */}
                  <div
                    className={cn(
                      "mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                      result.registered === false
                        ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    )}
                  >
                    {result.registered === false ? "Available" : "Registered"}
                  </div>

                  <div className="relative mb-6">
                    <h2 className="text-4xl font-bold tracking-tighter break-all text-slate-900 md:text-5xl">
                      {result.domain}
                    </h2>
                    <button
                      onClick={handleCopy}
                      className="absolute top-1/2 -right-10 -translate-y-1/2 rounded-full p-2 text-slate-300 transition-all hover:bg-slate-50 hover:text-slate-600 md:-right-12"
                      title="Copy domain name"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p
                    className={cn(
                      "mb-8 max-w-md text-base leading-relaxed font-medium",
                      result.registered === false
                        ? "text-emerald-700"
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
                          className="bg-primary h-14 w-full rounded-full px-8 text-base font-semibold shadow-md transition-all hover:scale-105 sm:w-auto"
                        >
                          Secure Domain
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => setResult(null)}
                        variant="outline"
                        size="lg"
                        className="h-14 w-full rounded-full border-slate-200 px-8 font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
                      >
                        Search Another
                      </Button>
                    )}
                  </div>

                  {result.isDemo && (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                      <Info className="h-3 w-3" />
                      Preview Mode: Connect your API key for live data.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bot Advice */}
            {result.registered === false && result.domain?.endsWith(".np") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                    NP
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-indigo-900">
                    Get this for free
                  </h4>
                  <p className="text-sm font-medium text-indigo-700">
                    .np domains are free. Nepdora can help you register this at
                    zero cost and connect it to your website automatically.
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
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {[
            {
              title: "AI-Powered Analysis",
              desc: "Check availability across 500+ global registries in real-time.",
              icon: Search,
            },
            {
              title: "Local Specialists",
              desc: "Full support for .com.np and other Nepal-specific extensions.",
              icon: Globe,
            },
            {
              title: "Auto-Integration",
              desc: "Connect your domain to Nepdora in one click.",
              icon: Activity,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
