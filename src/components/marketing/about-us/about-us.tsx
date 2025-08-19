"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Zap, Palette, Globe, Users, Rocket, Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <Badge
            variant="secondary"
            className="bg-primary/10 hover:bg-primary/20 mb-4 text-gray-700"
          >
            Website Builder Platform
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-700 lg:text-6xl">
            About Nepdora
          </h1>
          <Card className="mx-auto max-w-4xl border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              <p className="text-muted-foreground text-lg leading-relaxed lg:text-xl">
                Nepdora is a powerful website builder that helps creators,
                businesses, and entrepreneurs showcase their products
                beautifully. With drag-and-drop editing, customizable templates,
                and easy product management, building your online presence has
                never been simpler.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Story Behind Section */}
        <section className="mb-20">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-700 lg:text-4xl">
            The Story Behind Nepdora
          </h2>
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative h-64 overflow-hidden rounded-2xl shadow-xl lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration and innovation"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="prose prose-lg">
                <p className="text-muted-foreground leading-relaxed">
                  Born from the frustration of complex website builders and the
                  need for simplicity, Nepdora emerged as a solution that
                  bridges the gap between powerful functionality and
                  user-friendly design.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our journey began when we realized that creating a beautiful
                  online presence shouldn&apos;t require a computer science
                  degree. We set out to democratize web design, making it
                  accessible to everyone from solo entrepreneurs to growing
                  businesses.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, thousands of creators trust Nepdora to bring their
                  visions to life, proving that great design and powerful
                  functionality can coexist in perfect harmony.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement Section */}
        <section className="mb-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="outline"
              className="border-primary text-primary mb-6"
            >
              Our Mission
            </Badge>
            <h2 className="mb-8 text-3xl font-bold lg:text-5xl">
              <span className="text-gray-700">Empowering</span>{" "}
              <span className="text-primary">creators</span>{" "}
              <span className="text-gray-700">to build</span>{" "}
              <span className="text-primary">extraordinary</span>{" "}
              <span className="text-gray-700">digital experiences</span>
            </h2>
            <Card className="from-primary/5 to-secondary/5 border-0 bg-gradient-to-r shadow-lg">
              <CardContent className="p-8 lg:p-12">
                <p className="text-muted-foreground text-xl leading-relaxed font-medium lg:text-2xl">
                  We believe that every idea deserves a beautiful home on the
                  web. Our mission is to remove the barriers between imagination
                  and creation, providing tools that are both powerful enough
                  for professionals and simple enough for beginners.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Highlight Section */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-700 lg:text-4xl">
              Why Choose Nepdora?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Discover the features that make Nepdora the preferred choice for
              modern web creators
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Drag and drop interface"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <div className="bg-primary/10 mr-3 rounded-lg p-2">
                    <Zap className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    Drag & Drop Simplicity
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Build stunning websites with our intuitive drag-and-drop
                  editor. No coding required – just drag, drop, and watch your
                  vision come to life instantly.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <CardContent className="p-8">
                <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Beautiful templates and customization"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <div className="bg-secondary/10 mr-3 rounded-lg p-2">
                    <Palette className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    Premium Templates
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from hundreds of professionally designed templates.
                  Each template is fully customizable and optimized for
                  conversion and user experience.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:col-span-2 lg:col-span-1">
              <CardContent className="p-8">
                <div className="relative mb-6 h-48 overflow-hidden rounded-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Analytics and growth tools"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <div className="bg-primary/10 mr-3 rounded-lg p-2">
                    <Globe className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    Global Performance
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Lightning-fast loading times with our global CDN, built-in SEO
                  optimization, and mobile-first responsive design that looks
                  perfect on every device.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-700 lg:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardContent className="p-8">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Users className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  User-Centric
                </h3>
                <p className="text-muted-foreground">
                  Every feature we build starts with understanding our
                  users&apos; needs and pain points.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardContent className="p-8">
                <div className="bg-secondary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Rocket className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  Innovation
                </h3>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of what&apos;s possible in
                  web design and development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 text-center shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl">
              <CardContent className="p-8">
                <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Shield className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-700">
                  Reliability
                </h3>
                <p className="text-muted-foreground">
                  Your website is always online, secure, and performing at its
                  best with 99.9% uptime.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
