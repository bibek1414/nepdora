"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Feature {
  image: string;
  title: string;
  description: string;
  width: number;
  height: number;
}

const features: Feature[] = [
  {
    image: "/images/website1.avif",
    title: "Drag-n-drop",
    description:
      "Simply pick up the content you like, drag it where you want it, and drop into place.",
    width: 200,
    height: 200,
  },
  {
    image: "/images/website2.avif",
    title: "Use smart grid",
    description:
      "Keep everything perfectly aligned as you fine-tune your website.",
    width: 200,
    height: 200,
  },
  {
    image: "/images/website3.avif",
    title: "Change colors & fonts",
    description:
      "Explore what truly captures the essence of your brand or project.",
    width: 200,
    height: 200,
  },
  {
    image: "/images/website4.avif",
    title: "Customize elements",
    description:
      "Rearrange elements to create the website you've always wanted.",
    width: 200,
    height: 200,
  },
  {
    image: "/images/website5.avif",
    title: "Desktop and mobile editing",
    description:
      "Create, edit, and publish your website with ease on your chosen device.",
    width: 200,
    height: 200,
  },
];

export default function BuildYourWay() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
          Build a website your way
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Effortlessly perfect your website with user-friendly, tools.
        </p>
      </div>

      <div className="mb-12 flex flex-wrap justify-center gap-9">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group flex w-full max-w-xs flex-col items-center text-center sm:w-[45%] lg:w-[30%]"
          >
            {/* Image Container - FIXED SIZING */}
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-2xl p-3 transition-colors duration-300">
              <div className="relative h-24 w-24">
                <Image
                  src={feature.image}
                  alt={`${feature.title} - Nepdora feature illustration`}
                  width={feature.width}
                  height={feature.height}
                  className="h-full w-full"
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 640px) 96px, 96px"
                  loading={index > 2 ? "lazy" : "eager"}
                />
              </div>
            </div>

            {/* Content */}
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <Link href="/admin/signup">
          <Button size="lg" className="h-16 rounded-full px-10 py-4">
            Get started with Nepdora
          </Button>
        </Link>
      </div>
    </section>
  );
}
