"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ScrollItem {
  id: string;
  number: string;
  title: string;
  description: string;
  buttonText: string;
  image: string;
  bgColor: string;
}

const items: ScrollItem[] = [
  {
    id: "1",
    number: "01",
    title: "Providing wholesome food that fuels hope and spreads joy.",
    description:
      "We work to ensure communities have access to nutritious meals, empowering them with the resources to thrive and create a brighter future.",
    buttonText: "Discover more",
    image: "https://picsum.photos/seed/food/800/600",
    bgColor: "#e0f7fa",
  },
  {
    id: "2",
    number: "02",
    title:
      "Bring joy and hope by sending a gift to children dsjaldkjsa dlksajdlksaj dlkj d",
    description:
      "Through our gift-giving programs, we bring smiles to children, offering them not just toys but a sense of care and hope for a better tomorrow.",
    buttonText: "Discover more",
    image: "https://picsum.photos/seed/food/800/600",
    bgColor: "#e1e2f6",
  },
  {
    id: "3",
    number: "03",
    title: "Clean water for every community",
    description:
      "Access to clean water is a fundamental human right. We build sustainable water systems to ensure health and prosperity for all.",
    buttonText: "Discover more",
    image: "https://picsum.photos/seed/water/800/600",
    bgColor: "#f1f8e9",
  },
];

export default function StickyScroll() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-60">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold text-green-800">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
          OUR MISSION
        </div>
        <h2 className="mx-auto max-w-2xl text-4xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl">
          We provide essential support to vulnerable communities
        </h2>
      </div>

      {/* Sticky Cards */}
      <div className="space-y-0">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="sticky"
            style={{
              top: `${120}px`, // stacking offset
              zIndex: 2, // proper layering
              height: `${80}vh`,
            }}
          >
            <div
              className="overflow-hidden rounded-[40px] shadow-xl transition-transform duration-500"
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="flex h-150 flex-col md:flex-row">
                {/* Text */}
                <div className="flex flex-1 flex-col justify-between p-8 md:p-16">
                  <div>
                    <span className="mb-12 block text-3xl font-bold text-gray-900">
                      {item.number}
                    </span>
                    <h3 className="mb-6 text-3xl leading-tight font-bold text-gray-900 md:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mb-8 max-w-md text-lg leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>

                  <button className="group inline-flex w-fit items-center gap-2 rounded-full bg-black px-8 py-4 font-medium text-white transition-colors hover:bg-gray-800">
                    {item.buttonText}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>

                {/* Image */}
                <div className="relative min-h-[300px] flex-1 p-4 md:min-h-full md:p-6">
                  <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-[30px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ IMPORTANT: Dynamic scroll space */}
    </div>
  );
}
