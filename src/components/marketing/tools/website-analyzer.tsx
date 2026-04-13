"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  BarChart,
  Zap,
  Globe,
  Smartphone,
  Search,
  Shield,
  AlertCircle,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface AnalysisResult {
  url: string;
  domain: string;
  scores: {
    seo: number;
    speed: number;
    mobile: number;
    security: number;
  };
  recommendations: {
    critical: string[];
    high: string[];
    medium: string[];
  };
  metrics: {
    loadTime: string;
    pageSize: string;
    requests: number;
    seoScore: string;
  };
}

export const WebsiteAnalyzer = () => {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setAnalyzing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock analysis results
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`)
      .hostname;

    const mockResults: AnalysisResult = {
      url: url,
      domain: domain,
      scores: {
        seo: Math.floor(Math.random() * 40) + 50, // 50-90
        speed: Math.floor(Math.random() * 40) + 40, // 40-80
        mobile: Math.floor(Math.random() * 30) + 60, // 60-90
        security: Math.floor(Math.random() * 20) + 70, // 70-90
      },
      recommendations: {
        critical: [
          "Add meta descriptions to all pages",
          "Optimize images for faster loading",
        ],
        high: [
          "Improve mobile tap targets",
          "Add structured data for local business",
        ],
        medium: [
          "Increase font sizes for readability",
          "Add internal links to improve navigation",
        ],
      },
      metrics: {
        loadTime: `${(Math.random() * 3 + 1).toFixed(1)}s`,
        pageSize: `${Math.floor(Math.random() * 500 + 200)}KB`,
        requests: Math.floor(Math.random() * 40 + 20),
        seoScore: `${Math.floor(Math.random() * 30 + 60)}/100`,
      },
    };

    setResults(mockResults);
    setAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100";
    if (score >= 60) return "bg-amber-100";
    return "bg-rose-100";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Needs Improvement";
    return "Poor";
  };

  return (
    <div className="bg-transparent">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        {/* Input Form */}
        <form
          onSubmit={handleAnalyze}
          className="relative mx-auto mb-12 max-w-2xl"
        >
          <Input
            type="url"
            placeholder="https://yourwebsite.com"
            className="focus:border-primary focus:ring-primary h-14 w-full rounded-full border-slate-200 pr-36 pl-6 text-base placeholder:text-slate-400 focus:ring-1 focus:outline-none"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="absolute top-1.5 right-1.5 h-11 rounded-full px-6 font-semibold"
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Analyze Free"}
          </Button>
        </form>

        {/* Loading State */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 py-12"
          >
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="bg-primary h-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </div>
            <div className="space-y-2">
              <p className="animate-pulse font-medium text-slate-500">
                Analyzing your website...
              </p>
              <p className="text-xs text-slate-400">
                Checking SEO, speed, mobile responsiveness, and security
              </p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Score Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
              <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-slate-900">
                      {results.domain}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Analyzed for Nepali market
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium text-slate-600">
                    Overall Score:{" "}
                    {Math.floor(
                      (results.scores.seo +
                        results.scores.speed +
                        results.scores.mobile +
                        results.scores.security) /
                        4
                    )}
                    /100
                  </span>
                </div>
              </div>

              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "SEO", score: results.scores.seo, icon: Search },
                  { label: "Speed", score: results.scores.speed, icon: Zap },
                  {
                    label: "Mobile",
                    score: results.scores.mobile,
                    icon: Smartphone,
                  },
                  {
                    label: "Security",
                    score: results.scores.security,
                    icon: Shield,
                  },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="mb-2 flex justify-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${getScoreBgColor(item.score)}`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${getScoreColor(item.score)}`}
                        />
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(item.score)}`}
                    >
                      {item.score}
                    </div>
                    <div className="text-xs font-medium text-slate-500">
                      {item.label}
                    </div>
                    <div className="mt-1 text-[10px] font-medium text-slate-400">
                      {getScoreLabel(item.score)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Load Time
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {results.metrics.loadTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Page Size
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {results.metrics.pageSize}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Requests</p>
                  <p className="text-lg font-bold text-slate-900">
                    {results.metrics.requests}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    SEO Score
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {results.metrics.seoScore}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 -sm">
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Recommendations
              </h3>
              <div className="space-y-4">
                {results.recommendations.critical.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-rose-600">
                      Critical Issues
                    </p>
                    <ul className="space-y-2">
                      {results.recommendations.critical.map((rec, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-sm font-semibold text-amber-600">
                    High Priority
                  </p>
                  <ul className="space-y-2">
                    {results.recommendations.high.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-blue-600">
                    Medium Priority
                  </p>
                  <ul className="space-y-2">
                    {results.recommendations.medium.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA to Build with Nepdora */}
            <div className="border-primary/20 bg-primary/5 rounded-2xl border p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                Want a website that scores 90+?
              </h3>
              <p className="mb-4 text-sm text-slate-600">
                Build with Nepdora and get SEO-optimized, fast-loading websites
                that are ready for the Nepali market.
              </p>
              <Link
                href="/admin/signup"
                className="text-primary inline-flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2"
              >
                Create My High-Speed Website
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Re-analyze Button */}
            <button
              onClick={() => {
                setResults(null);
                setUrl("");
              }}
              className="hover:text-primary text-sm font-medium text-slate-500 transition-colors"
            >
              Analyze another website →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
