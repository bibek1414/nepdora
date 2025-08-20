"use client";
import React, { useState, useEffect } from "react";

const CountdownAnimation = () => {
  const [currentText, setCurrentText] = useState("Three.");
  const [showAll, setShowAll] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const sequence = ["Three.", "Two.", "Online"];

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < sequence.length - 1) {
        setIsVisible(false);

        setTimeout(() => {
          currentIndex++;
          setCurrentText(sequence[currentIndex]);
          setIsVisible(true);
        }, 200);
      } else {
        // After showing "Online", show all text together
        setTimeout(() => {
          setShowAll(true);
        }, 1000);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto flex max-w-5xl items-center py-24">
      <div className="flex w-full max-w-6xl items-center">
        {/* Text Section */}
        <div className="flex flex-1 flex-col items-start">
          <div className="relative flex flex-col gap-2">
            {showAll ? (
              // Show all text at once
              <div className="animate-in fade-in-0 slide-in-from-left-4 duration-500">
                <div className="text-primary text-6xl leading-tight font-bold md:text-6xl lg:text-6xl">
                  Three.
                </div>
                <div className="text-secondary text-6xl leading-tight font-bold md:text-6xl lg:text-6xl">
                  Two.
                </div>
                <div className="text-primary text-6xl leading-tight font-bold md:text-6xl lg:text-6xl">
                  Online
                </div>
              </div>
            ) : (
              // Show one at a time
              <div className="flex h-32 items-center">
                <h1
                  className={`text-6xl font-bold transition-all duration-300 ease-in-out md:text-7xl lg:text-8xl ${
                    isVisible
                      ? "translate-y-0 transform opacity-100"
                      : "translate-y-4 transform opacity-0"
                  } ${
                    currentText === "Three."
                      ? "text-primary"
                      : currentText === "Two."
                        ? "text-secondary"
                        : "text-primary"
                  }`}
                >
                  {currentText}
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative max-w-lg">
            <img
              src="/images/about.avif"
              alt="Three Two Online Animation"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform gap-2">
        {sequence.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              sequence.indexOf(currentText) === index
                ? "bg-primary"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CountdownAnimation;
