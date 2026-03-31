"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
  MapPin,
  ArrowRight,
  Phone,
  Globe,
  Award,
  Shield,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CountryDetailsData } from "@/types/owner-site/components/countries";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CountryDetailsStyle1Props {
  data: CountryDetailsData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (data: Partial<CountryDetailsData>) => void;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const CountryDetailsStyle1: React.FC<CountryDetailsStyle1Props> = ({
  data,
}) => {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Fetch country data. If no slug (e.g. in builder), fetch all and take the first one AS A SAMPLE.
  const { data: countriesResponse, isLoading: isCountryLoading } =
    useCollectionData("countries", slug ? { slug } : { page_size: "1" });

  const country = countriesResponse?.results?.[0]?.data;

  // Fetch related universities
  const { data: universitiesResponse, isLoading: isUniLoading } =
    useCollectionData(
      "universities",
      country?.slug ? { country: country.slug } : { page_size: "12" }
    );

  const universities = universitiesResponse?.results || [];

  if (isCountryLoading) {
    return (
      <div className="min-h-screen space-y-8 p-8">
        <Skeleton className="h-[50vh] w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md text-center">
          <Globe className="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-20" />
          <h2 className="mb-2 text-3xl font-bold">Select a Country</h2>
          <p className="text-muted-foreground mb-6">
            This page will display details for the selected study destination.
            Add some countries to your collection to see them here.
          </p>
        </div>
      </div>
    );
  }

  // Parse highlights (pipe separated string from JSON)
  const highlights = country.highlights
    ? country.highlights.split("|").map((s: string) => s.trim())
    : [];

  return (
    <div className="bg-background" style={{ fontFamily: theme?.fonts?.body }}>
      {/* Hero Section */}
      <motion.section
        className="relative h-[45vh] min-h-[400px] overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {country.Image && (
          <Image
            src={country.Image}
            alt={`Study in ${country.name}`}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
            <motion.div variants={fadeInUp}>
              <Badge
                className="mb-6 rounded-full px-4 py-1 text-xs font-semibold tracking-wider"
                style={{
                  backgroundColor: theme?.colors?.primary,
                  color: theme?.colors?.primaryForeground,
                }}
              >
                Study Destination
              </Badge>
              <h1
                className="mb-6 text-4xl leading-tight font-bold text-white sm:text-6xl"
                style={{ fontFamily: theme?.fonts?.heading }}
              >
                Study in{" "}
                <span style={{ color: theme?.colors?.primary }}>
                  {country.name}
                </span>
              </h1>
              <p className="max-w-2xl text-lg font-medium text-white/90 md:text-xl">
                {country.tagline || "Your gateway to international education."}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quick Stats Section */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 md:gap-12">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-bold">
                Tuition Fees
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {country.tuition_cost || "Varies"}
              </p>
            </div>
            <div className="space-y-1 sm:border-x">
              <p className="text-muted-foreground text-xs font-bold">
                Living Costs
              </p>
              <p className="text-2xl font-semibold tracking-tight">
                {country.living_cost || "Varies"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-bold">Intakes</p>
              <p className="text-2xl font-semibold tracking-tight">
                {country.intakes || "Multiple"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-16 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-16 lg:col-span-2">
              <div className="prose prose-slate prose-lg max-w-none">
                <h2
                  className="mb-8 text-3xl font-bold tracking-tight text-slate-900"
                  style={{ fontFamily: theme?.fonts?.heading }}
                >
                  Overview
                </h2>
                <div
                  className="leading-relaxed text-slate-600"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeContent(country.content),
                  }}
                />
              </div>

              {highlights.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2">
                  {highlights.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-6 transition-all duration-300 hover:border-slate-200 hover:shadow-sm"
                    >
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 transition-colors"
                        style={{ color: theme?.colors?.primary }}
                      >
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="text-base font-medium text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {country.work_visa_details && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 md:p-10">
                  <div className="mb-8 flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm"
                      style={{ color: theme?.colors?.primary }}
                    >
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3
                      className="text-2xl font-bold tracking-tight text-slate-900"
                      style={{ fontFamily: theme?.fonts?.heading }}
                    >
                      Post-Study Work Rights
                    </h3>
                  </div>
                  <div
                    className="prose prose-slate max-w-none text-slate-600"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeContent(country.work_visa_details),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="overflow-hidden border-none py-0 shadow-none">
                <CardHeader
                  className="p-8 text-white"
                  style={{ backgroundColor: theme?.colors?.primary }}
                >
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Phone className="h-5 w-5" /> Ready to Apply?
                  </CardTitle>
                  <p className="mt-2 text-sm font-medium opacity-90">
                    Get expert guidance for your application process.
                  </p>
                </CardHeader>
                <CardContent className="">
                  <Separator className="bg-slate-50" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-2 text-sm font-bold">
                          Visa Processing
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {country.visa_info || "Consult with us"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-2 text-sm font-bold">
                          Popular Courses
                        </p>
                        <p className="text-sm font-semibold text-slate-900">
                          {country.popular_courses || "All domains"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Universities Section */}
      <section className="bg-slate-50/50 py-24" id="universities">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2
              className="mb-4 text-4xl font-bold tracking-tight text-slate-900"
              style={{ fontFamily: theme?.fonts?.heading }}
            >
              Top Universities in {country.name}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Explore world-class institutions we can help you apply to.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isUniLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))
            ) : universities.length > 0 ? (
              universities.map((uni: any) => (
                <div
                  key={uni.id}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-6 transition-all duration-300",
                    "hover:border-transparent hover:shadow-xl hover:shadow-slate-200/50"
                  )}
                >
                  <Badge
                    variant="secondary"
                    className="mb-4 w-fit bg-slate-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600"
                  >
                    {uni.data.ranking || "Top Ranked"}
                  </Badge>
                  <h4
                    className="mb-2 text-lg leading-tight font-bold tracking-tight text-slate-900"
                    style={{
                      fontFamily: theme?.fonts?.heading,
                    }}
                  >
                    {uni.data.name}
                  </h4>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                    <MapPin className="h-3 w-3" />{" "}
                    {uni.data.location || country.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground italic">
                  Experience the best of {country.name} education.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
