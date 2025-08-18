import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Palette, Settings, Zap } from "lucide-react";
import { ProcessStep } from "@/types/marketing/process";


const ProcessSection: React.FC = () => {
  const steps: ProcessStep[] = [
    {
      number: "01",
      title: "Choose Your Template",
      description: "Pick from 500+ professional templates or let AI create a custom design for your brand.",
      icon: Palette,
    },
    {
      number: "02",
      title: "Customize Your Content",
      description: "Use our intuitive drag-and-drop editor to add your content, images, and branding.",
      icon: Settings,
    },
    {
      number: "03",
      title: "Launch Your Website",
      description: "Connect your domain, set up payments, and go live with just one click.",
      icon: Zap,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Clock className="mr-2 h-4 w-4" />
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            From Idea to
            <span className="bg-primary bg-clip-text text-transparent">
              {" "}Live Website
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your business online in just three simple steps. No technical skills required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary z-0 transform translate-x-1/2"></div>
              )}
              <Card className="relative z-10 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">{step.number}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;