import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { TEAM } from "@/types/owner-site/team-member";

interface TeamCard1Props {
  member: TEAM;
  onClick?: () => void;
}

export const TeamCard1: React.FC<TeamCard1Props> = ({ member, onClick }) => {
  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Social links overlay */}
          <div className="absolute right-4 bottom-4 left-4 flex justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {member.email && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={e => handleSocialClick(e, `mailto:${member.email}`)}
              >
                <Mail className="h-4 w-4" />
              </Button>
            )}
            {member.facebook && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={e => handleSocialClick(e, member.facebook)}
              >
                <Facebook className="h-4 w-4" />
              </Button>
            )}
            {member.instagram && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={e => handleSocialClick(e, member.instagram)}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {member.linkedin && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={e => handleSocialClick(e, member.linkedin)}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 text-center">
          <h3 className="mb-1 text-xl font-bold text-gray-900">
            {member.name}
          </h3>
          <p className="text-primary mb-2 font-semibold">{member.role}</p>
          {member.department && (
            <p className="mb-3 text-sm text-gray-500">
              {member.department.name}
            </p>
          )}
          {member.about && (
            <p className="line-clamp-3 text-sm text-gray-600">{member.about}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
