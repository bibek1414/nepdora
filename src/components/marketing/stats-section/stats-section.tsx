import React from 'react';
import { Stat } from '@/types/marketing/stat';

const StatsSection: React.FC = () => {
  const stats: Stat[] = [
    {
      number: '50,000+',
      label: 'Active Websites',
      description: 'Built and deployed successfully',
    },
    {
      number: '99.9%',
      label: 'Uptime Guarantee',
      description: 'Reliable hosting infrastructure',
    },
    {
      number: '4.9/5',
      label: 'Customer Rating',
      description: 'Based on 10,000+ reviews',
    },
    {
      number: '24/7',
      label: 'Expert Support',
      description: 'Always here when you need us',
    },
  ];

  return (
    <section className="from-primary/5 to-secondary/5 bg-gradient-to-r py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-primary mb-2 text-4xl font-bold">
                {stat.number}
              </div>
              <div className="text-foreground mb-1 text-lg font-semibold">
                {stat.label}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
