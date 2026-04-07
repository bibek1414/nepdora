"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, BarChart, Zap, Globe } from "lucide-react";

export const WebsiteAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 2500);
  };

  return (
    <div className="bg-transparent">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <form
          onSubmit={handleAnalyze}
          className="relative mx-auto mb-20 max-w-2xl"
        >
          <Input
            type="url"
            placeholder="https://yourwebsite.com"
            className="focus:ring-primary h-14 rounded-full border-slate-200 pr-40 pl-6 text-base placeholder:text-slate-400"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="absolute top-1.5 right-1.5 h-11 rounded-full px-8 font-semibold"
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Analyze Free"}
          </Button>
        </form>

        {analyzing && (
          <div className="space-y-6 py-12">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="bg-primary h-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </div>
            <p className="animate-pulse font-medium text-slate-500">
              Gathering performance data and SEO metrics...
            </p>
          </div>
        )}

        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-20 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-left md:p-12"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-xl font-bold text-green-600">
                82
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  Analysis for {new URL(url).hostname}
                </h2>
                <p className="text-xs text-slate-500">Target Market: Nepal</p>
              </div>
            </div>

            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex gap-4">
                <Globe className="text-primary h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold">SEO Optimization</h3>
                  <p className="text-sm text-slate-600">
                    Keywords and meta descriptions are present but could be more
                    targeted for local search in Nepal.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Zap className="text-primary h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold">Loading Speed</h3>
                  <p className="text-sm text-slate-600">
                    LCP and FCP are within acceptable ranges, but image
                    optimization is needed.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="text-primary h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold">Mobile Responsive</h3>
                  <p className="text-sm text-slate-600">
                    Your site looks great on mobile, which is essential for the
                    70%+ mobile users in Nepal.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <BarChart className="text-primary h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold">Performance</h3>
                  <p className="text-sm text-slate-600">
                    Solid technical foundation, but server response time could
                    be improved with local hosting.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
