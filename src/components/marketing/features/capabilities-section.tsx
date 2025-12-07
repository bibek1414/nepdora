import React from "react";
import DesignAnimation from "./design-animation";
import LogisticsAnimation from "./logistics-animation";
import SeoAnimation from "./seo-animation";

const FeatureBlock: React.FC<{
  title: string;
  description: string;
  Visual: React.FC;
  reversed?: boolean;
}> = ({ title, description, Visual, reversed = false }) => {
  return (
    <div
      className={`border-border flex flex-col items-center gap-12 border-t py-20 md:flex-row md:gap-20 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 text-left">
        <h2 className="text-foreground mb-4 text-2xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed font-light">
          {description}
        </p>
      </div>

      <div className="w-full flex-1">
        <div className="border-border bg-background relative aspect-[16/9] overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-300 hover:shadow-md">
          <Visual />
        </div>
      </div>
    </div>
  );
};

const CapabilitiesSection: React.FC = () => {
  return (
    <section
      id="capabilities"
      className="bg-background mx-auto max-w-6xl px-6 py-24"
    >
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

export default CapabilitiesSection;
