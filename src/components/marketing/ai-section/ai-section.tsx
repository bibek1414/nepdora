import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AISection() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side - Image FIXED */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src="/images/image3.avif"
                alt="AI Website Builder Interface with automated design tools"
                fill
                className="rounded-2xl object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
                quality={85}
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="order-1 space-y-8 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl leading-tight font-bold text-black lg:text-4xl">
                Start selling online faster with AI
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-lg text-gray-800">
                    Describe your store and let AI build a high-converting
                    storefront and product pages.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-lg text-gray-800">
                    Upload product images to instantly generate descriptions and
                    remove backgrounds.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-lg text-gray-800">
                    Sell up to 600 products with 100+ payment methods and no
                    hidden transaction fees.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/admin/signup">
                <Button size="lg" className="h-16 rounded-full">
                  Launch Your Website in Minutes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
