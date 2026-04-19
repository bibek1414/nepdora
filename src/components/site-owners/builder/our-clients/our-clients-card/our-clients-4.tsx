import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Handshake } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface OurClients4Props {
  data: OurClientsData;
  isEditable?: boolean;
}

export const OurClients4: React.FC<OurClients4Props> = ({
  data,
  isEditable = false,
}) => {
  const { data: clientsData, isLoading, refetch } = useGetOurClients({});

  if (isLoading) {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-8 border-y border-gray-100 py-8 md:gap-12 lg:gap-16">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-md" />
        ))}
      </div>
    );
  }

  const clients = clientsData || [];

  return (
    <>
      {clients.length > 0 && (
        <div className="flex w-full items-center justify-center border-y border-gray-100 py-8 dark:border-gray-800">
          <div className="flex w-full flex-wrap items-center justify-center gap-8 px-4 sm:gap-12 md:gap-16 lg:gap-16">
            {clients.slice(0, 6).map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="logo-item shrink-0 cursor-pointer opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
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
                      className="h-8 w-auto object-contain md:h-10 lg:h-12"
                    />
                  </a>
                ) : (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-8 w-auto object-contain md:h-10 lg:h-12"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        className={
          clients.length === 0 ? "w-full border-y border-gray-100 py-8" : ""
        }
      >
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
      </div>
    </>
  );
};
