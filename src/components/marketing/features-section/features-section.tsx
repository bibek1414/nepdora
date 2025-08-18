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
import {Feature} from "@/types/marketing/feature";


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
    <section id="features" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Target className="mr-2 h-4 w-4" />
            Features
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Everything You Need to
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Succeed Online
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools and features to help you create, manage, and grow
            your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-primary/10 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 ">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
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
