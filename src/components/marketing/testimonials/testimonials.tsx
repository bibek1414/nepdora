"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { useTestimonials } from "@/hooks/super-admin/use-testimonials"; // Adjust the import path as needed
import Image from "next/image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

const CustomerTestimonials = () => {
  const { data: testimonialsData, isLoading, error } = useTestimonials();

  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-primary text-primary"
            : "fill-muted text-muted-foreground"
        }`}
      />
    ));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-background px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-foreground mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
              Thousands of Nepdora Lovers
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm">
              Loading testimonials...
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map(item => (
              <Card
                key={item}
                className="border-border bg-card transition-shadow duration-300 hover:border"
              >
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="mb-4 flex items-center">
                      <div className="mr-4 h-12 w-12 rounded-full bg-gray-300"></div>
                      <div>
                        <div className="mb-2 h-4 w-24 rounded bg-gray-300"></div>
                        <div className="h-3 w-20 rounded bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="mb-4 h-4 w-full rounded bg-gray-300"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-300"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-background px-4 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-foreground mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Thousands of Nepdora Lovers
          </h2>
          <p className="text-muted-foreground">
            Failed to load testimonials. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Use dynamic data or fallback to empty array
  const testimonials: Testimonial[] = testimonialsData || [];

  return (
    <div className="bg-background px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Thousands of Nepdora Lovers
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-sm">
            Don&apos;t just take our word for it – thousands of customers trust
            Nepdora.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {testimonials.length > 0 ? (
            testimonials.map(testimonial => (
              <Card
                key={testimonial.id}
                className="border-border bg-card transition-shadow duration-300 hover:border"
              >
                <CardContent className="p-6">
                  {/* Customer Info with Image */}
                  <div className="mb-4 flex items-center">
                    {testimonial.image && (
                      <div className="mr-4 flex-shrink-0">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-card-foreground mb-1 text-lg font-semibold">
                        {testimonial.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {testimonial.designation}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="mb-4 flex gap-1">
                    {renderStars(5)}{" "}
                    {/* Assuming 5 stars for all testimonials */}
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {testimonial.comment}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback when no testimonials are available
            <div className="col-span-3 py-8 text-center">
              <p className="text-muted-foreground">
                No testimonials available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href={"/admin/signup"}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 rounded-full px-8 py-3 font-medium transition-colors duration-200"
            >
              Read more reviews
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerTestimonials;
