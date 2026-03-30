"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  DollarSign,
  MapPin,
  Calendar,
  ArrowRight,
  Phone,
  Globe,
  Award,
  Users,
  Sun,
  Shield,
  Heart,
  Clock,
  Plane,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CountryDetailsData } from "@/types/owner-site/components/countries";
import { useCollectionData } from "@/hooks/owner-site/admin/use-collections";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { Skeleton } from "@/components/ui/skeleton";

interface CountryDetailsStyle1Props {
  data: CountryDetailsData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (data: Partial<CountryDetailsData>) => void;
}

const fadeInUp = {
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

  // Fetch country data. If no slug (e.g. in builder), fetch all and take the first one AS A SAMPLE.
  const { data: countriesResponse, isLoading: isCountryLoading } =
    useCollectionData("countries", slug ? { slug } : { page_size: "1" });

  const country = countriesResponse?.results?.[0]?.data;

  // Fetch related universities
  const { data: universitiesResponse, isLoading: isUniLoading } =
    useCollectionData(
      "universities",
      country?.slug ? { country: country.slug } : { page_size: "4" }
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
    <div className="bg-background">
      {/* Hero Section */}
      <motion.section
        className="relative h-[60vh] min-h-[500px] overflow-hidden"
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
        <div className="from-background via-background/60 absolute inset-0 bg-linear-to-t to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold tracking-wider uppercase">
              Study Destination
            </Badge>
            <h1 className="text-foreground mb-4 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              Study in <span className="text-primary">{country.name}</span>
            </h1>
            <p className="text-muted-foreground max-w-3xl text-xl font-medium md:text-2xl">
              {country.tagline || "Your gateway to international education."}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Highlights / Quick Stats */}
      <section className="bg-muted/30 border-y py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-muted-foreground mb-1 text-sm font-bold tracking-widest uppercase">
                Tuition Fees
              </p>
              <p className="text-xl font-black">
                {country.tuition_cost || "Varies"}
              </p>
            </div>
            <div className="border-l pl-8 text-center md:pl-16">
              <p className="text-muted-foreground mb-1 text-sm font-bold tracking-widest uppercase">
                Living Costs
              </p>
              <p className="text-xl font-black">
                {country.living_cost || "Varies"}
              </p>
            </div>
            <div className="border-l pl-8 text-center md:pl-16">
              <p className="text-muted-foreground mb-1 text-sm font-bold tracking-widest uppercase">
                Intakes
              </p>
              <p className="text-xl font-black">
                {country.intakes || "Multiple"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-12 lg:col-span-2">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2 className="mb-6 text-3xl font-bold">Overview</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeContent(country.content),
                  }}
                />
              </div>

              {highlights.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {highlights.map((item: string, i: number) => (
                    <Card
                      key={i}
                      className="bg-card/50 border-primary/10 hover:border-primary/30 transition-colors"
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                          <Award className="text-primary h-5 w-5" />
                        </div>
                        <span className="text-sm font-semibold md:text-base">
                          {item}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {country.work_visa_details && (
                <Card className="bg-muted/50 overflow-hidden border-none shadow-xl">
                  <CardHeader className="bg-primary/5 border-primary/10 border-b p-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary text-primary-foreground rounded-2xl p-3">
                        <Shield className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-2xl font-black tracking-tight uppercase">
                        Post-Study Work Rights
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div
                      className="rich-text prose prose-primary dark:prose-invert max-w-none font-medium"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeContent(country.work_visa_details),
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card className="border-primary/20 sticky top-24 overflow-hidden shadow-2xl">
                <div className="bg-primary text-primary-foreground p-6">
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    <Phone className="h-5 w-5" /> Ready to Apply?
                  </h3>
                </div>
                <CardContent className="space-y-6 p-8">
                  <div className="space-y-4">
                    <Button
                      className="h-14 w-full rounded-xl text-lg font-bold"
                      size="lg"
                    >
                      Start Application <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 w-full rounded-xl text-lg font-bold"
                      size="lg"
                    >
                      Download Guide
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="group flex items-center gap-4">
                      <div className="bg-muted group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl transition-colors">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                          Visa Processing
                        </p>
                        <p className="text-sm font-bold">
                          {country.visa_info || "Consult with us"}
                        </p>
                      </div>
                    </div>
                    <div className="group flex items-center gap-4">
                      <div className="bg-muted group-hover:bg-primary/20 flex h-10 w-10 items-center justify-center rounded-xl transition-colors">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                          Popular Courses
                        </p>
                        <p className="line-clamp-1 text-sm font-bold">
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
      <section className="bg-muted/40 py-24" id="universities">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
              Top Universities in {country.name}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Explore world-class institutions we can help you apply to.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {isUniLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))
            ) : universities.length > 0 ? (
              universities.map((uni: any) => (
                <Card
                  key={uni.id}
                  className="group hover:border-primary border-primary/5 overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl"
                >
                  <CardContent className="p-6">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 transition-colors"
                    >
                      {uni.data.ranking || "Top Ranked"}
                    </Badge>
                    <h4 className="group-hover:text-primary mb-2 text-xl font-black tracking-tight transition-colors">
                      {uni.data.name}
                    </h4>
                    <p className="text-muted-foreground flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />{" "}
                      {uni.data.location || country.name}
                    </p>
                  </CardContent>
                </Card>
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
