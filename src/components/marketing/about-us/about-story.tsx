import React from "react";

const AboutStory: React.FC = () => {
  return (
    <section className="mx-auto mb-16 px-4 sm:mb-32 sm:px-6 lg:max-w-7xl lg:px-20">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16 lg:gap-32">
        <div className="md:w-1/3">
          <h2 className="sticky top-24 text-2xl font-bold text-slate-900 sm:top-32 sm:text-3xl">
            The Story.
            <br />
            <span className="font-normal text-slate-400">Why we exist.</span>
          </h2>
        </div>
        <div className="text-slate-600 md:w-2/3">
          <p className="mb-6 font-serif text-xl text-slate-800 italic sm:text-2xl">
            "Why is it so hard to get online in Nepal?"
          </p>
          <p className="mb-4 text-sm leading-relaxed sm:text-base sm:leading-loose">
            That was the question that started it all. In 2023, we watched
            brilliant local entrepreneurs struggle. They had amazing
            products—pashminas, organic coffee, handcrafted silver—but their
            digital presence was broken.
          </p>
          <p className="mb-4 text-sm leading-relaxed sm:text-base sm:leading-loose">
            They were held hostage by agencies charging Rs 50,000 for a static
            page. They were stuck with platforms like Wix that billed in Dollars
            (which they couldn't pay). They were confused by servers, SSLs, and
            DNS records.
          </p>
          <p className="mb-4 text-sm leading-relaxed font-semibold sm:text-base sm:leading-loose">
            We took it personally.
          </p>
          <p className="text-sm leading-relaxed sm:text-base sm:leading-loose">
            We built Nepdora to be the bridge. We wrote code that speaks Nepali
            commerce—integrating eSewa, understanding local logistics, and
            optimizing for local Google rankings. We didn't just build a tool;
            we built a partner that handles the boring stuff so you can build
            your empire.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
