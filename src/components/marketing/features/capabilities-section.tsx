"use client";
import React from "react";
import { FeatureBlock } from "./features-block";
import { DesignAnimation } from "./design-animation";
import { LogisticsAnimation } from "./logistics-animation";
import { SeoAnimation } from "./seo-animation";

const Features: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl bg-white px-2 py-12 sm:px-0 sm:py-16">
      <FeatureBlock
        title="Design that adapts to you."
        description="Our AI doesn't just swap templates. It understands your brand's voice, generates custom typography pairings, and builds a unique visual identity that feels expensive and bespoke."
        Visual={DesignAnimation}
      />

      <FeatureBlock
        title="Logistics that handle themselves."
        description="We automatically route orders to the best carriers based on location (Kathmandu valley or outside). From printing labels to tracking returns, your operations are on autopilot."
        Visual={LogisticsAnimation}
        reversed
      />

      <FeatureBlock
        title="SEO that wins rankings."
        description="Technical SEO is hard. We make it invisible. Nepdora generates JSON-LD schema, optimizes core web vitals, and structures your content to rank #1 automatically on Google."
        Visual={SeoAnimation}
      />
    </section>
  );
};

export default Features;
