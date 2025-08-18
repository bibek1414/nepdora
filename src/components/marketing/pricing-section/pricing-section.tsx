import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Zap,
  Star,
  Crown,
  CreditCard,
  Users,
  Heart,
} from "lucide-react";
import { PricingPlan } from "@/types/marketing/price-plan";
const PricingSection: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small businesses getting started",
      icon: Zap,
      color: "primary",
      features: [
        "1 Website",
        "Basic Templates",
        "Mobile Responsive",
        "Basic Analytics",
        "Email Support",
        "SSL Certificate",
        "Custom Domain (1 year free)",
      ],
      cta: "Get Started Free",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Best for growing businesses",
      icon: Star,
      color: "secondary",
      features: [
        "Up to 5 Websites",
        "All Templates + AI Custom",
        "Advanced Analytics",
        "Priority Support",
        "Mini CRM System",
        "Payment Processing",
        "Support Ticket System",
        "Custom Domain",
        "SEO Tools",
        "Social Media Integration",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large businesses and agencies",
      icon: Crown,
      color: "accent",
      features: [
        "Unlimited Websites",
        "Custom AI Design",
        "Advanced CRM",
        "24/7 Phone Support",
        "White-label Options",
        "API Access",
        "Advanced Analytics",
        "Team Management",
        "Custom Integrations",
        "Dedicated Account Manager",
        "Priority Feature Requests",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <CreditCard className="mr-2 h-4 w-4" />
            Pricing
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Simple, Transparent
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include our
            core features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "ring-2 ring-primary shadow-2xl transform scale-105 bg-gradient-to-br from-primary/5 to-secondary/5"
                  : "shadow-lg hover:shadow-xl"
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-${
                    plan.color === "primary"
                      ? "primary"
                      : plan.color === "secondary"
                      ? "secondary"
                      : "primary"
                  }/10 text-${
                    plan.color === "primary"
                      ? "primary"
                      : plan.color === "secondary"
                      ? "secondary"
                      : "primary"
                  }`}
                >
                  <plan.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="mb-4">
                  {plan.description}
                </CardDescription>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period !== "forever" && (
                    <span className="text-muted-foreground text-sm">
                      /{plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-center mb-8">
                All Plans Include
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Users,
                    title: "No Setup Fees",
                    description: "Get started immediately",
                  },
                  {
                    icon: Zap,
                    title: "Instant Setup",
                    description: "5-minute deployment",
                  },
                  {
                    icon: Heart,
                    title: "30-Day Money Back",
                    description: "Risk-free guarantee",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{benefit.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
