import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GridOptions, HeroSectionProps } from '@/types/marketing/hero';

const RetroGrid: React.FC<GridOptions> = ({
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
}) => {
  const gridStyles = {
    '--grid-angle': `${angle}deg`,
    '--cell-size': `${cellSize}px`,
    '--opacity': opacity,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        'pointer-events-none absolute size-full overflow-hidden [perspective:200px]',
        `opacity-[var(--opacity)]`
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            'animate-grid [background-size:var(--cell-size)_var(--cell-size)] [background-repeat:repeat]',
            '[inset:0%_0px] [margin-left:-50%] [height:300vh] [width:200vw] [transform-origin:100%_0_0]',
            '[background-image:linear-gradient(to_right,hsl(var(--primary))_1px,transparent_0),linear-gradient(to_bottom,hsl(var(--primary))_1px,transparent_0)]'
          )}
        />
      </div>
      <div className="from-background absolute inset-0 bg-gradient-to-t to-transparent to-90%" />
    </div>
  );
};

const HeroSection: React.FC<HeroSectionProps> = ({
  className,
  title = 'Build products for everyone',
  subtitle = {
    regular: 'Designing your projects faster with ',
    gradient: 'the largest figma UI kit.',
  },
  description,
  ctaText = 'Browse courses',
  ctaHref = '#',
  bottomImage,
  gridOptions,
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background gradient */}
      <div className="from-primary/10 absolute top-0 z-[0] h-screen w-full bg-gradient-to-b via-transparent to-transparent" />

      <section className="relative z-1 mx-auto max-w-full">
        <RetroGrid {...gridOptions} />

        <div className="z-10 mx-auto max-w-screen-xl gap-12 px-4 py-28 md:px-8">
          <div className="mx-auto max-w-3xl space-y-5 text-center leading-0 lg:leading-5">
            <h1 className="text-muted-foreground group bg-background/80 border-border mx-auto w-fit rounded-3xl border px-5 py-2 text-sm font-medium shadow-sm backdrop-blur-sm">
              {title}
              <ChevronRight className="text-primary ml-2 inline h-4 w-4 duration-300 group-hover:translate-x-1" />
            </h1>

            <h2 className="text-foreground mx-auto text-4xl font-bold tracking-tighter md:text-6xl">
              {subtitle.regular}
              <br />
              <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent">
                {subtitle.gradient}
              </span>
            </h2>

            {description && (
              <p className="text-muted-foreground mx-auto max-w-2xl">
                {description}
              </p>
            )}

            <div className="items-center justify-center space-y-3 gap-x-3 sm:flex sm:space-y-0">
              <span className="relative inline-block overflow-hidden rounded-full p-[2px]">
                <span className="from-primary via-primary/60 to-primary absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r" />
                <div className="bg-background inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium backdrop-blur-3xl">
                  <a
                    href={ctaHref}
                    className="group text-primary-foreground from-primary to-primary/80 inline-flex w-full items-center justify-center rounded-full border-0 bg-gradient-to-r px-10 py-4 text-center font-medium transition-all hover:opacity-90 sm:w-auto"
                  >
                    {ctaText}
                  </a>
                </div>
              </span>
            </div>
          </div>

          {bottomImage && (
            <div className="relative z-10 mx-4 mt-32 md:mx-10">
              <img
                src={bottomImage.light}
                className="border-border w-full rounded-lg border shadow-2xl dark:hidden"
                alt="Dashboard preview"
              />
              <img
                src={bottomImage.dark}
                className="border-border hidden w-full rounded-lg border shadow-2xl dark:block"
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
