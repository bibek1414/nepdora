import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Handshake } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface OurClients1Props {
  data: OurClientsData;
  isEditable?: boolean;
}

export const OurClients1: React.FC<OurClients1Props> = ({
  data,
  isEditable = false,
}) => {
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
      <BuilderEmptyState
        icon={Handshake}
        title="No Clients Added"
        description="Display your clients or partners. Add client logos in the admin dashboard."
        actionLabel="Manage Clients"
        actionLink="/admin/our-clients"
        isEditable={isEditable}
      />
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
      {clients.map(client => (
        <div
          key={client.id}
          className="flex items-center justify-center transition-all duration-200 hover:opacity-80"
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
                className="h-8 w-auto object-contain md:h-10"
              />
            </a>
          ) : (
            <img
              src={client.logo}
              alt={client.name}
              className="h-8 w-auto object-contain md:h-10"
            />
          )}
        </div>
      ))}
    </div>
  );
};
