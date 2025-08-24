"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AboutUs2Data } from "@/types/owner-site/components/about";

interface AboutUsTemplate2Props {
  aboutUsData: AboutUs2Data;
}

export function AboutUsTemplate2({ aboutUsData }: AboutUsTemplate2Props) {
  const { title, subtitle, description, teamMembers } = aboutUsData;

  return (
    <section className="bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
            {title}
          </h2>
          <p className="text-primary mb-4 text-lg font-semibold">{subtitle}</p>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map(member => (
            <Card
              key={member.id}
              className="transform overflow-hidden text-center transition-transform hover:scale-105 hover:shadow-xl"
            >
              <CardHeader className="p-0">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-64 w-full object-cover object-center"
                  onError={e => {
                    e.currentTarget.src = "https://via.placeholder.com/400x400";
                  }}
                />
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-foreground text-xl font-semibold">
                  {member.name}
                </h3>
                <p className="text-primary font-medium">{member.role}</p>
                {member.bio && (
                  <p className="text-muted-foreground mt-2 text-sm">
                    {member.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
