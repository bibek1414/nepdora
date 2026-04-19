import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { OurClient } from "@/types/owner-site/admin/our-client";
import { Handshake } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface OurClients5Props {
  data: OurClientsData;
  isEditable?: boolean;
}

export const OurClients5: React.FC<OurClients5Props> = ({
  data,
  isEditable = false,
}) => {
  const { data: clientsData, isLoading, refetch } = useGetOurClients({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-12 opacity-20 md:gap-20">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    );
  }

  const clients = clientsData || [];

  return (
    <>
      {clients.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale transition-opacity duration-700 hover:opacity-100 hover:grayscale-0 md:gap-20">
          {clients.map((client: OurClient) => (
            <div
              key={client.id}
              className="relative h-6 w-24 grayscale transition-transform duration-300 hover:scale-110 hover:grayscale-0 md:h-8 md:w-32"
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
      )}
      <BuilderEmptyState
        icon={Handshake}
        title="No Clients Added"
        description="Display your clients or partners. Add client logos in the admin dashboard."
        actionLabel="Add New Client"
        actionLink="/admin/our-clients"
        isEditable={isEditable}
        isEmpty={clients.length === 0}
        onRefresh={refetch}
      />
    </>
  );
};
