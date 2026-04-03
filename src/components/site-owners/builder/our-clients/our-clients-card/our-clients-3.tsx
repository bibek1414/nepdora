import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { Skeleton } from "@/components/ui/skeleton";

interface OurClients3Props {
  data: OurClientsData;
}

export const OurClients3: React.FC<OurClients3Props> = ({ data }) => {
  const { data: clientsData, isLoading } = useGetOurClients({});

  if (isLoading) {
    return (
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-32 rounded-full" />
        ))}
      </div>
    );
  }

  const clients = clientsData || [];

  if (clients.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No clients added yet.
      </div>
    );
  }

  // Duplicate the list once to create two identical sets for a perfect loop
  const marqueeItems = [...clients, ...clients];

  return (
    <div className="relative mx-auto w-full max-w-7xl overflow-hidden select-none">
      {/* Left Gradient Overlay - Faded Edge */}
      <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-linear-to-r to-transparent"></div>

      {/* Marquee Container */}
      <div className="marquee-inner flex min-w-[200%] will-change-transform">
        <div className="flex items-center">
          {marqueeItems.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              className="mx-6 h-12 w-32 flex-shrink-0 cursor-pointer overflow-hidden opacity-60 transition-all duration-300 hover:opacity-100 md:mx-10 md:h-16 md:w-40"
            >
              {client.url ? (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full w-full items-center justify-center"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-full w-auto object-contain"
                    draggable="false"
                  />
                </a>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-full w-auto object-contain"
                    draggable="false"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Gradient Overlay - Faded Edge */}
      <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-linear-to-l to-transparent md:w-40"></div>

      {/* Animation Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes marqueeScroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .marquee-inner {
            animation: marqueeScroll 30s linear infinite;
          }
        `,
        }}
      />
    </div>
  );
};
