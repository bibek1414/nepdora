"use client";

import React from "react";
import { FeatureBlock } from "./features-block";
import { DesignAnimation } from "./design-animation";
import { LogisticsAnimation } from "./logistics-animation";
import { SeoAnimation } from "./seo-animation";

export const CapabilitiesAnimations = () => {
  return (
    <>
      <div className="py-10">
        <DesignAnimation />
      </div>
      <FeatureBlock
        title="Built In Logistics Integration."
        description="Nepdora helps you enable logistics to deliver your orders directly without any hassle. We automatically route orders to the best providers based on location (Kathmandu valley or outside). From printing labels to tracking returns, your operations are on autopilot."
        Visual={LogisticsAnimation}
        reversed
      />

      <FeatureBlock
        title="Website Ranks #1 on Google"
        description="SEO is hard. We make it invisible. Nepdora generates JSON-LD schema, optimizes core web vitals, and structures your content to rank #1 automatically on Google."
        Visual={SeoAnimation}
      />
    </>
  );
};
