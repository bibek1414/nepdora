import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Zap,
  Shield,
  BarChart3,
  ShoppingCart,
  Users,
  MessageSquare,
  Truck,
  Palette,
  CreditCard,
  Smartphone,
  Settings,
  Target,
} from "lucide-react";
import { Feature } from "@/types/marketing/feature";

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Palette,
      title: "AI-Powered Templates",
      description:
        "Choose from 500+ stunning templates or let AI create a custom design that matches your brand perfectly.",
    },
    {
      icon: ShoppingCart,
      title: "Complete E-commerce",
      description:
        "Full online store with product management, inventory tracking, payment processing, and order fulfillment.",
    },
    {
      icon: Users,
      title: "Mini CRM System",
      description:
        "Manage customer relationships, track leads, and automate follow-ups with our built-in CRM tools.",
    },
    {
      icon: MessageSquare,
      title: "Support Ticket System",
      description:
        "Handle customer inquiries efficiently with automated ticket routing and response management.",
    },
    {
      icon: Globe,
      title: "Custom Domain",
      description:
        "Connect your own domain name and get professional email addresses for your business.",
    },
    {
      icon: Truck,
      title: "Logistics Integration",
      description:
        "Seamless order placement to delivery tracking with major shipping and logistics partners.",
    },
    {
      icon: Zap,
      title: "5-Minute Setup",
      description:
        "Get your business online in just 5 minutes with our streamlined onboarding process.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with SSL certificates, data encryption, and regular security audits.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track your business performance with detailed analytics, sales reports, and customer insights.",
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description:
        "Accept payments from customers worldwide with support for all major payment methods.",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description:
        "Your website looks perfect on all devices with responsive design and mobile-first approach.",
    },
    {
      icon: Settings,
      title: "Easy Management",
      description:
        "Intuitive dashboard to manage your entire business operations from one central location.",
    },
  ];

  return (
    <section id="features" className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need to
            <span className="from-primary to-secondary block bg-gradient-to-r bg-clip-text text-transparent">
              Succeed Online
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Powerful tools and features to help you create, manage, and grow
            your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border-primary/10 hover:border-primary/20 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
