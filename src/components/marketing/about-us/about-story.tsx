import React from "react";
import {
  AboutStoryFadeInLeft,
  AboutStoryFadeInUp,
} from "./about-story-animations";

const AboutStory: React.FC = () => {
  return (
    <section className="mx-auto mt-40 mb-24 px-4 sm:mb-40 sm:px-6 lg:max-w-7xl lg:px-20">
      <div className="flex flex-col gap-12 md:flex-row md:gap-20 lg:gap-32">
        <AboutStoryFadeInLeft>
          <h2 className="sticky top-32 text-4xl font-bold text-neutral-900 sm:text-5xl">
            The Story.
            <br />
            <span className="font-serif font-light text-neutral-400 italic">
              Why we exist.
            </span>
          </h2>
        </AboutStoryFadeInLeft>

        <AboutStoryFadeInUp>
          <p className="font-serif text-2xl text-neutral-900 sm:text-3xl lg:text-4xl">
            Why is it so hard to get online in Nepal?
          </p>

          <div className="space-y-6 text-lg leading-relaxed font-light sm:text-xl">
            <p>
              That was the question that started it all. In 2023, we watched
              brilliant local entrepreneurs struggle. They had amazing
              products-pashminas, organic coffee, handcrafted silver-but their
              digital presence was broken.
            </p>
            <p>
              They were held hostage by agencies charging Rs 50,000 for a static
              page. They were stuck with platforms like Wix that billed in
              Dollars (which they couldn't pay). They were confused by servers,
              SSLs, and DNS records.
            </p>
            <p className="font-medium text-neutral-900">
              We took it personally.
            </p>
            <p>
              We built Nepdora to be the bridge. We wrote code that speaks
              Nepali commerce-integrating eSewa, understanding local logistics,
              and optimizing for local Google rankings. We didn't just build a
              tool; we built a partner that handles the boring stuff so you can
              build your empire.
            </p>
          </div>
        </AboutStoryFadeInUp>
      </div>
    </section>
  );
};

export default AboutStory;
