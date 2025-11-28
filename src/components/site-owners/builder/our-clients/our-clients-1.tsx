import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { Skeleton } from "@/components/ui/skeleton";

interface OurClients1Props {
  data: OurClientsData;
}

export const OurClients1: React.FC<OurClients1Props> = ({ data }) => {
  const { data: clientsData, isLoading } = useGetOurClients({});

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  const clients = clientsData || [];

  if (clients.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No clients added yet. Go to Admin &gt; Our Clients to add some.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 items-center justify-items-center gap-8 md:grid-cols-4 lg:grid-cols-5">
      {clients.map(client => (
        <div
          key={client.id}
          className="flex items-center justify-center p-4 grayscale transition-all duration-200 hover:grayscale-0"
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
                className="max-h-12 w-auto object-contain"
              />
            </a>
          ) : (
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-12 w-auto object-contain"
            />
          )}
        </div>
      ))}
    </div>
  );
};
