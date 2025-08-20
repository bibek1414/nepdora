"use client";
import React, { useState } from "react";

const OurStrengths = () => {
  const [activeStrength, setActiveStrength] = useState(1);

  const strengths = [
    {
      id: 1,
      title: "Seamless management tools",
      description:
        "Regardless of your background or technical expertise, our site-building and management tools have been created with user experience and power in mind. Control everything in one place with hPanel, from domains and web hosting to email accounts and more. Have more time for what matters with our AI-powered drag-and-drop Nepdora Website Builder – create and publish a website within minutes, without limits.",
    },
    {
      id: 2,
      title: "Website speed",
      description:
        "We want website creators and business owners to move forward, and fast. Imagine having your site load in milliseconds anywhere in the world with our globally distributed servers and 99.9% uptime guarantee. Give your audience the best user experience, and watch as your site rankings improve.",
    },
    {
      id: 3,
      title: "Dedicated 24/7 support",
      description:
        "We are here for every committed online hustler who aims to rock the web. Our Customer Success team speaks 10+ languages, so you can confidently communicate your thoughts and concerns in your own language. Spend less time worrying about technical issues – we promise to get back to you quickly with helpful solutions.",
    },
  ];

  const activeStrengthData = strengths.find(
    strength => strength.id === activeStrength
  );

  return (
    <section className="bg-background mx-auto max-w-6xl px-4 py-16">
      <div className="mb-16 text-center">
        <h2 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
          Our strengths
        </h2>
      </div>

      <div className="grid items-center lg:grid-cols-2">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            {strengths.map(strength => (
              <div
                key={strength.id}
                className="group relative cursor-pointer"
                onClick={() => setActiveStrength(strength.id)}
              >
                {/* Purple accent line for active item */}
                {activeStrength === strength.id && (
                  <div className="bg-primary absolute top-0 bottom-0 left-0 w-1 rounded-full"></div>
                )}

                <div
                  className={`pl-6 ${activeStrength === strength.id ? "pl-8" : "pl-6"} transition-all duration-200`}
                >
                  <h3
                    className={`hover:text-primary text-xl font-semibold transition-colors duration-200 ${
                      activeStrength === strength.id
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    {strength.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Interactive Content Display */}
        <div className="relative">
          {/* Dynamic Content Display */}
          <div className="bg-card relative z-10 min-h-[300px] rounded-xl border p-6">
            <div className="space-y-4">
              <h3 className="text-card-foreground text-xl font-bold">
                {activeStrengthData?.title}
              </h3>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {activeStrengthData?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStrengths;
