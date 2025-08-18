import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Palette, Settings, Zap } from 'lucide-react';
import { ProcessStep } from '@/types/marketing/process';

const ProcessSection: React.FC = () => {
  const steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Choose Your Template',
      description:
        'Pick from 500+ professional templates or let AI create a custom design for your brand.',
      icon: Palette,
    },
    {
      number: '02',
      title: 'Customize Your Content',
      description:
        'Use our intuitive drag-and-drop editor to add your content, images, and branding.',
      icon: Settings,
    },
    {
      number: '03',
      title: 'Launch Your Website',
      description:
        'Connect your domain, set up payments, and go live with just one click.',
      icon: Zap,
    },
  ];

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            <Clock className="mr-2 h-4 w-4" />
            How It Works
          </Badge>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            From Idea to
            <span className="bg-primary bg-clip-text text-transparent">
              {' '}
              Live Website
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Get your business online in just three simple steps. No technical
            skills required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="from-primary to-secondary absolute top-12 left-1/2 z-0 hidden h-0.5 w-full translate-x-1/2 transform bg-gradient-to-r md:block"></div>
              )}
              <Card className="relative z-10 text-center transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="from-primary to-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-primary mb-2 text-sm font-bold">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
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
