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

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
      {clients.map(client => (
        <div key={client.id} className="group relative">
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 blur transition duration-200 group-hover:opacity-20"></div>
          <div className="relative flex items-center justify-center rounded-lg bg-white p-2">
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
                  className="h-12 w-auto object-contain opacity-70 transition-opacity hover:opacity-100"
                />
              </a>
            ) : (
              <img
                src={client.logo}
                alt={client.name}
                className="h-12 w-auto object-contain opacity-70 transition-opacity hover:opacity-100"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
