import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GridOptions, HeroSectionProps } from "@/types/marketing/hero";

const RetroGrid: React.FC<GridOptions> = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
}) => {
  const gridStyles = {
    "--grid-angle": `${angle}deg`,
    "--cell-size": `${cellSize}px`,
    "--opacity": opacity,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden [perspective:200px]",
        `opacity-[var(--opacity)]`
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid [background-repeat:repeat] [background-size:var(--cell-size)_var(--cell-size)]",
            "[height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200vw]",
            "[background-image:linear-gradient(to_right,hsl(var(--primary))_1px,transparent_0),linear-gradient(to_bottom,hsl(var(--primary))_1px,transparent_0)]"
          )}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent to-90%" />
    </div>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  title = "Build products for everyone",
  subtitle = {
    regular: "Designing your projects faster with ",
    gradient: "the largest figma UI kit.",
  },
  description,
  ctaText = "Browse courses",
  ctaHref = "#",
  bottomImage,
  gridOptions,
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background gradient */}
      <div className="absolute top-0 z-[0] h-screen w-full bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

      <section className="relative max-w-full mx-auto z-1">
        <RetroGrid {...gridOptions} />

        <div className="max-w-screen-xl z-10 mx-auto px-4 py-28 gap-12 md:px-8">
          <div className="space-y-5 max-w-3xl leading-0 lg:leading-5 mx-auto text-center">
            <h1 className="text-sm text-muted-foreground group font-medium mx-auto px-5 py-2 bg-background/80 backdrop-blur-sm border border-border rounded-3xl w-fit shadow-sm">
              {title}
              <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-1 duration-300 text-primary" />
            </h1>

            <h2 className="text-4xl tracking-tighter font-bold mx-auto md:text-6xl text-foreground">
              {subtitle.regular}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                {subtitle.gradient}
              </span>
            </h2>

            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}

            <div className="items-center justify-center gap-x-3 space-y-3 sm:flex sm:space-y-0">
              <span className="relative inline-block overflow-hidden rounded-full p-[2px]">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r from-primary via-primary/60 to-primary" />
                <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-background text-sm font-medium backdrop-blur-3xl">
                  <a
                    href={ctaHref}
                    className="inline-flex rounded-full text-center group items-center w-full justify-center text-primary-foreground font-medium border-0 hover:opacity-90 transition-all sm:w-auto py-4 px-10 bg-gradient-to-r from-primary to-primary/80"
                  >
                    {ctaText}
                  </a>
                </div>
              </span>
            </div>
          </div>

          {bottomImage && (
            <div className="mt-32 mx-4 md:mx-10 relative z-10">
              <img
                src={bottomImage.light}
                className="w-full shadow-2xl rounded-lg border border-border dark:hidden"
                alt="Dashboard preview"
              />
              <img
                src={bottomImage.dark}
                className="hidden w-full shadow-2xl rounded-lg border border-border dark:block"
                alt="Dashboard preview"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
