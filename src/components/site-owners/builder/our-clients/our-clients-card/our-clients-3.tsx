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

  // Duplicate the list to create the seamless infinite loop effect
  // Ensure we have enough items to fill the screen width for a smooth marquee
  const marqueeItems = [...clients, ...clients, ...clients, ...clients];

  return (
    <div className="flex w-full flex-col items-center">
      {/* Header Label similar to the screenshot */}

      {/* Constrained width container */}
      <div className="group relative w-full max-w-4xl overflow-hidden">
        {/* The Scrolling Container */}
        <div
          className="group/marquee relative w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        >
          {/* The Moving Strip */}
          <div className="animate-scroll flex w-max items-center gap-16 pr-16 md:gap-24 md:pr-24">
            {marqueeItems.map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="logo-item flex-shrink-0 cursor-pointer opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              >
                {client.url ? (
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="h-20 w-auto object-contain"
                    />
                  </a>
                ) : (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-20 w-auto object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
