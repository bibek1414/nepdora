import React from "react";
import { Button } from "@/components/ui/button";
import {
  AboutTeamAnimations,
  AboutTeamHeaderFadeIn,
  AboutTeamSectionWrapper,
} from "./about-team-animations";

const AboutTeam: React.FC = () => {
  const teamMembers = [
    {
      name: "Sushil Sharma",
      role: "CEO",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
      delay: 0,
    },
    {
      name: "Priya KC",
      role: "Product",
      img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      delay: 0.2,
    },
    {
      name: "Amit Pradhan",
      role: "Tech Lead",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
      delay: 0.4,
    },
    {
      name: "Sita Gurung",
      role: "Customer Success",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
      delay: 0.6,
    },
  ];

  return (
    <AboutTeamSectionWrapper>
      <AboutTeamHeaderFadeIn>
        <div>
          <h2 className="mb-3 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            Real people. Real support.
          </h2>
          <p className="max-w-lg text-sm text-slate-500 sm:text-base">
            We don't hide behind chatbots. We work out of Sankhamul. Come say
            hi.
          </p>
        </div>
        <Button variant="outline" size="sm" className="sm:size-default">
          Join the Team
        </Button>
      </AboutTeamHeaderFadeIn>

      <AboutTeamAnimations teamMembers={teamMembers} />
    </AboutTeamSectionWrapper>
  );
};

export default AboutTeam;
