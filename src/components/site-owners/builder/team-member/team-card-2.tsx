import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { TEAM } from "@/types/owner-site/admin/team-member";

interface TeamCard2Props {
  member: TEAM;
  onClick?: () => void;
}

export const TeamCard2: React.FC<TeamCard2Props> = ({ member, onClick }) => {
  const handleSocialClick = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Card
      className="group cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
      onClick={onClick}
    >
      <CardContent className="p-8 text-center">
        <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <h3 className="mb-2 text-2xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-primary mb-2 text-lg font-semibold">{member.role}</p>

        {member.department && (
          <div className="bg-primary/10 text-primary mb-4 inline-block rounded-full px-3 py-1 text-sm font-medium">
            {member.department.name}
          </div>
        )}

        {member.about && (
          <p className="mb-6 line-clamp-4 text-gray-600">{member.about}</p>
        )}

        <div className="flex justify-center gap-3">
          {member.email && (
            <Button
              size="icon"
              variant="outline"
              className="hover:bg-primary h-10 w-10 rounded-full hover:text-white"
              onClick={e => handleSocialClick(e, `mailto:${member.email}`)}
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          {member.facebook && (
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full hover:border-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={e => handleSocialClick(e, member.facebook)}
            >
              <Facebook className="h-4 w-4" />
            </Button>
          )}
          {member.instagram && (
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full hover:border-pink-600 hover:bg-pink-600 hover:text-white"
              onClick={e => handleSocialClick(e, member.instagram)}
            >
              <Instagram className="h-4 w-4" />
            </Button>
          )}
          {member.linkedin && (
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full hover:border-blue-700 hover:bg-blue-700 hover:text-white"
              onClick={e => handleSocialClick(e, member.linkedin)}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
