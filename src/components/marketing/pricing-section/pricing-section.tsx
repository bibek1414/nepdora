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
    <section id="pricing" className="bg-muted/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            <CreditCard className="mr-2 h-4 w-4" />
            Pricing
          </Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Simple, Transparent
            <span className="from-primary to-secondary block bg-gradient-to-r bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Choose the perfect plan for your business. All plans include our
            core features with no hidden fees.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "ring-primary from-primary/5 to-secondary/5 scale-105 transform bg-gradient-to-br shadow-2xl ring-2"
                  : "shadow-lg hover:shadow-xl"
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                  <Badge className="from-primary to-secondary bg-gradient-to-r text-white">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${
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
                  <plan.icon className="h-6 w-6" />
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
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 bg-gradient-to-r text-white"
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
          <Card className="from-primary/5 to-secondary/5 bg-gradient-to-r">
            <CardContent className="p-8">
              <h3 className="mb-8 text-center text-xl font-bold">
                All Plans Include
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                    <div className="bg-primary/10 mr-4 flex h-10 w-10 items-center justify-center rounded-lg">
                      <benefit.icon className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{benefit.title}</div>
                      <div className="text-muted-foreground text-sm">
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
