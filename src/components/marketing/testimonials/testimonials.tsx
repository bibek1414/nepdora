import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award } from "lucide-react";
import { Testimonial } from "@/types/marketing/testimonial";

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechStart Inc",
      content: "Nepdora helped us launch our website in just 3 minutes. The AI-powered templates are incredible and our conversion rate increased by 150%.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b88b6e9b?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Founder",
      company: "EcoMarket",
      content: "The e-commerce features are outstanding. We went from idea to selling products online in under an hour. Customer support is phenomenal too.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Marketing Director",
      company: "Creative Studio",
      content: "The CRM integration saved us thousands on separate tools. Everything we need is in one place. Our team productivity increased by 200%.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Award className="mr-2 h-4 w-4" />
            Testimonials
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Loved by
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}50,000+ Businesses
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">See what our customers have to say about their experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">&apos;{testimonial.content}&apos;</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary mr-3"></div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;