import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { useGetOurClients } from "@/hooks/owner-site/admin/use-our-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface OurClients2Props {
  data: OurClientsData;
}

export const OurClients2: React.FC<OurClients2Props> = ({ data }) => {
  const { data: clientsData, isLoading } = useGetOurClients({});

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
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
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {clients.map(client => (
        <Card
          key={client.id}
          className="flex items-center justify-center border-none shadow-sm transition-shadow hover:shadow-md"
        >
          <CardContent className="flex h-32 items-center justify-center p-6">
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
                  className="max-h-16 max-w-full object-contain"
                />
              </a>
            ) : (
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-16 max-w-full object-contain"
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
