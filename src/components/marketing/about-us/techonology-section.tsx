import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Technology() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero Section - Image Left, Text Right */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-1">
            <div className="relative z-10">
              <Image
                src="/images/about4.avif"
                alt="Innovation illustration"
                width={500}
                height={400}
                className="h-auto w-full rounded-lg"
                priority
              />
            </div>
          </div>
          <div className="order-2 space-y-6">
            <Badge variant="secondary">TECHNOLOGY</Badge>
            <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
              Innovation on the go
            </h1>
            <p className="text-lg leading-relaxed text-gray-600">
              As one of the fastest and most efficient web hosting service
              providers around, we keep adapting to the latest tech advancements
              in the industry. We constantly improve our infrastructure with
              blazing-fast NVMe SSD drives, LiteSpeed-powered tech stack, and
              our custom-built control panel – hPanel.
            </p>
            <Link href="/signup">
              <Button className="px-6 py-3 text-white">
                Learn more about our tech
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section - Image Right, Text Left */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-1 space-y-6">
              <Badge variant="secondary">PEOPLE</Badge>
              <h2 className="text-3xl leading-tight font-bold text-gray-900 lg:text-4xl">
                A committed team of heroes
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Nepdora is one of the fastest-growing web hosting and AI website
                builder providers, with over 1,000 employees in 54 countries.
                Like our dedication to our clients, we take care of our own so
                that we can grow professionally and take our customers to the
                next level. Join Nepdora and hustle with us.
              </p>
              <Link href="/signup">
                <Button className="px-6 py-3">Get Started</Button>
              </Link>
            </div>
            <div className="relative order-2">
              <div className="relative z-10">
                <Image
                  src="/images/about5.avif"
                  alt="Team collaboration"
                  width={500}
                  height={400}
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Obsession Section - Image Left, Text Right */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative order-1">
              <div className="relative z-10">
                <Image
                  src="/images/about6.avif"
                  alt="Customer listening illustration"
                  width={500}
                  height={400}
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
            <div className="order-2 space-y-6">
              <Badge variant="secondary">CUSTOMER OBSESSION</Badge>
              <h2 className="text-3xl leading-tight font-bold text-gray-900 lg:text-4xl">
                Before we speak, we listen
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                You, The Customer, hold the highest rank at Nepdora. Your
                feedback is key to improving our products, processes, and
                overall customer satisfaction. We always seek out our
                clients&apos; input through surveys, online reviews, and
                one-on-one interviews.
              </p>
              <Link href="/contact">
                <Button
                  className="px-6 py-3 text-white"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  Contact us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
