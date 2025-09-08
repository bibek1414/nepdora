import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { TEAM } from "@/types/owner-site/team-member";

interface TeamCard3Props {
  member: TEAM;
  onClick?: () => void;
}

export const TeamCard3: React.FC<TeamCard3Props> = ({ member, onClick }) => {
  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex-1 p-6">
            <div className="flex h-full flex-col">
              <div className="mb-4">
                <h3 className="mb-1 text-2xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-primary text-lg font-semibold">
                  {member.role}
                </p>
                {member.department && (
                  <p className="mt-1 text-gray-500">{member.department.name}</p>
                )}
              </div>

              {member.about && (
                <p className="mb-4 line-clamp-4 flex-1 text-gray-600">
                  {member.about}
                </p>
              )}

              <div className="mt-auto flex gap-3">
                {member.email && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary h-9 w-9 hover:text-white"
                    onClick={e =>
                      handleSocialClick(e, `mailto:${member.email}`)
                    }
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                )}
                {member.facebook && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={e => handleSocialClick(e, member.facebook)}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                )}
                {member.instagram && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 hover:border-pink-600 hover:bg-pink-600 hover:text-white"
                    onClick={e => handleSocialClick(e, member.instagram)}
                  >
                    <Instagram className="h-4 w-4" />
                  </Button>
                )}
                {member.linkedin && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 hover:border-blue-700 hover:bg-blue-700 hover:text-white"
                    onClick={e => handleSocialClick(e, member.linkedin)}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
