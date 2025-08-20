import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

interface Testimonial {
  name: string;
  role: string;
  review: string;
  rating: number;
}

const CustomerTestimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Martinez",
      role: "E-commerce Owner",
      review:
        "Switching to Nepdora was the best decision for my online business. Their uptime is incredible and the loading speeds have improved my conversion rates by 40%. The migration process was seamless and their support team guided me through every step.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Full-stack Developer",
      review:
        "As a developer, I need reliable hosting that can handle complex applications. Nepdora's infrastructure is robust and their developer tools are top-notch. I've deployed over 50 projects here and never faced any major issues.",
      rating: 5,
    },
    {
      name: "Maria Rodriguez",
      role: "Digital Agency CEO",
      review:
        "Managing multiple client websites became effortless with Nepdora. Their white-label solutions and bulk management tools have streamlined our operations. Our clients love the performance improvements they've experienced.",
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
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

  return (
    <div className="bg-background px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            Thousands of satisfied customers
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Don&apos;t just take our word for it – thousands of customers trust
            Nepdora for their hosting needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border bg-card border transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                {/* Customer Info */}
                <div className="mb-4">
                  <h3 className="text-card-foreground mb-1 text-lg font-semibold">
                    {testimonial.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>

                {/* Star Rating */}
                <div className="mb-4 flex gap-1">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Review Text */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {testimonial.review}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href={"/signup"}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8 py-3 font-medium transition-colors duration-200"
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
