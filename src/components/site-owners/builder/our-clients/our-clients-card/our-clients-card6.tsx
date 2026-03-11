"use client";

import React from "react";
import { OurClientsData } from "@/types/owner-site/components/our-client";
import { OurClient } from "@/types/owner-site/admin/our-client";
import Image from "next/image";

interface OurClientsCard6Props {
  clients: OurClient[];
  data: OurClientsData;
}

export const OurClientsCard6: React.FC<OurClientsCard6Props> = ({
  clients,
  data,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
      {clients.map(client => (
        <div
          key={client.id}
          className="group relative flex h-32 w-32 items-center justify-center rounded-full bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl md:h-48 md:w-48"
        >
          <div className="relative h-20 w-20">
            {client.url ? (
              <a
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-full w-full object-contain"
                />
              </a>
            ) : (
              <img
                src={client.logo}
                alt={client.name}
                className="h-full w-full object-contain"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
