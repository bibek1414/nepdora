"use client";

import Image from "next/image";

export default function FeatureShowcase() {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-2">
      {/* Left Image Section */}
      <div className="relative h-[500px] overflow-hidden rounded-2xl lg:h-auto">
        <Image
          src="/images/hero-dev.jpg" // replace with your image path
          alt="Developer working"
          fill
          className="object-cover"
        />
        <div className="absolute bottom-6 left-6 max-w-xs rounded-xl bg-black/50 p-6 text-white backdrop-blur-sm">
          <button className="mb-3 rounded-full border border-white/30 bg-white/20 px-4 py-1 text-sm">
            Build Products
          </button>
          <h2 className="text-lg leading-snug font-medium">
            Convert your innovative ideas into powerful products
          </h2>
        </div>
      </div>

      {/* Right Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top Card */}
        <div className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
          <button className="mb-3 rounded-full border bg-gray-100 px-4 py-1 text-sm">
            Faster Workflow
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            Customize without page_sizes with Avora
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Accelerate development cycle to launch apps in days, not months.
          </p>
        </div>

        {/* Bottom Left Card */}
        <div className="flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-sm">
          <Image
            src="/images/platform-stack.png" // replace with your illustration
            alt="Platform stack"
            width={300}
            height={200}
            className="rounded-lg"
          />
          <h3 className="mt-4 text-lg font-semibold">
            A platform built for full-stack functionality
          </h3>
        </div>

        {/* Bottom Right Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white p-6 text-center shadow-sm">
          <h3 className="text-4xl font-bold text-gray-900">598+</h3>
          <p className="mt-2 text-sm text-gray-600">
            Apps built on the most secure platform
          </p>
          <button className="mt-4 rounded-full border border-gray-300 px-5 py-2 text-gray-700 transition hover:bg-gray-100">
            Try Demo Now →
          </button>
        </div>
      </div>
    </section>
  );
}
