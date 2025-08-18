"use client";

import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-primary mb-6 text-3xl font-bold">About Nepdora</h1>

      <Card className="bg-secondary/10 rounded-2xl shadow-md">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-base leading-relaxed">
            Nepdora is a powerful website builder that helps creators,
            businesses, and entrepreneurs showcase their products beautifully.
            With drag-and-drop editing, customizable templates, and easy product
            management, building your online presence has never been simpler.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
