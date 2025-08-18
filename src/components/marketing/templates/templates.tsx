"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TemplatesPage = () => {
  const templates = [
    {
      id: 1,
      name: "Modern Shop",
      description: "Clean layout for online stores.",
    },
    { id: 2, name: "Portfolio", description: "Showcase your work and skills." },
    {
      id: 3,
      name: "Landing Page",
      description: "Perfect for product launches.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-primary mb-8 text-3xl font-bold">
        Choose a Template
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {templates.map(template => (
          <Card
            key={template.id}
            className="rounded-2xl shadow-md transition hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-secondary text-lg">
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {template.description}
              </p>
              <Button className="bg-primary hover:bg-primary/90 w-full text-white">
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
