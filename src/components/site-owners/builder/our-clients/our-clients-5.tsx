import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { OurClient } from "@/types/owner-site/admin/our-client";

interface OurClients5Props {
  data: OurClientsData;
}

export const OurClients5: React.FC<OurClients5Props> = ({ data }) => {
  const { data: clientsData, isLoading } = useGetOurClients({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-12 opacity-20 md:gap-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded bg-gray-200"
          />
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

  return (
    <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 transition-opacity duration-700 hover:opacity-100 grayscale hover:grayscale-0 md:gap-20">
      {clients.map((client: OurClient) => (
        <div
          key={client.id}
          className="relative h-6 w-24 transition-transform duration-300 hover:scale-110 hover:grayscale-0 grayscale md:h-8 md:w-32"
        >
          {client.url ? (
            <a
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full w-full"
            >
              <img
                src={client.logo as string}
                alt={client.name}
                className="h-full w-full object-contain"
              />
            </a>
          ) : (
            <img
              src={client.logo as string}
              alt={client.name}
              className="h-full w-full object-contain"
            />
          )}
        </div>
      ))}
    </div>
  );
};
