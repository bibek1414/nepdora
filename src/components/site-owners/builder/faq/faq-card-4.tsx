import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/types/owner-site/admin/faq";
import {
  HelpCircle,
  Globe,
  Headset,
  CreditCard,
  PartyPopper,
  MapPin,
  FileWarning,
  Clock,
  Calendar,
  Settings,
} from "lucide-react";

const iconMap = {
  default: {
    icon: HelpCircle,
    color: "text-icon-purple",
    bg: "bg-icon-bg-purple-light dark:bg-icon-bg-purple-dark",
  },
  service: {
    icon: Globe,
    color: "text-icon-purple",
    bg: "bg-icon-bg-purple-light dark:bg-icon-bg-purple-dark",
  },
  support: {
    icon: Headset,
    color: "text-icon-pink",
    bg: "bg-icon-bg-pink-light dark:bg-icon-bg-pink-dark",
  },
  payment: {
    icon: CreditCard,
    color: "text-icon-yellow",
    bg: "bg-icon-bg-yellow-light dark:bg-icon-bg-yellow-dark",
  },
  event: {
    icon: PartyPopper,
    color: "text-icon-blue",
    bg: "bg-icon-bg-blue-light dark:bg-icon-bg-blue-dark",
  },
  location: {
    icon: MapPin,
    color: "text-icon-violet",
    bg: "bg-icon-bg-violet-light dark:bg-icon-bg-violet-dark",
  },
  policy: {
    icon: FileWarning,
    color: "text-icon-orange",
    bg: "bg-icon-bg-orange-light dark:bg-icon-bg-orange-dark",
  },
  time: {
    icon: Clock,
    color: "text-icon-green",
    bg: "bg-icon-bg-green-light dark:bg-icon-bg-green-dark",
  },
  booking: {
    icon: Calendar,
    color: "text-icon-teal",
    bg: "bg-icon-bg-teal-light dark:bg-icon-bg-teal-dark",
  },
  technical: {
    icon: Settings,
    color: "text-icon-gray",
    bg: "bg-icon-bg-gray-light dark:bg-icon-bg-gray-dark",
  },
};

const iconRotation = Object.keys(iconMap);

interface FAQCard4Props {
  faqs: FAQ[];
  title?: string;
  subtitle?: string;
  useRotatingIcons?: boolean;
}

export const FAQCard4: React.FC<FAQCard4Props> = ({
  faqs,
  title = "Frequently Asked Questions",
  subtitle = "Find Answers to Your Queries about TNC Conf and Our Exceptional Event Services",
  useRotatingIcons = false,
}) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Function to determine icon type based on question content
  const getIconType = (
    question: string,
    index: number
  ): keyof typeof iconMap => {
    if (useRotatingIcons) {
      return iconRotation[index % iconRotation.length] as keyof typeof iconMap;
    }

    const lowerQuestion = question.toLowerCase();

    // More sophisticated matching
    const keywordMap: Record<string, keyof typeof iconMap> = {
      support: "support",
      contact: "support",
      help: "support",
      payment: "payment",
      pay: "payment",
      card: "payment",
      price: "payment",
      event: "event",
      service: "service",
      manage: "service",
      location: "location",
      area: "location",
      region: "location",
      venue: "location",
      cancellation: "policy",
      policy: "policy",
      refund: "policy",
      time: "time",
      schedule: "time",
      duration: "time",
      booking: "booking",
      reserve: "booking",
      registration: "booking",
      technical: "technical",
      setup: "technical",
      equipment: "technical",
    };

    for (const [keyword, iconType] of Object.entries(keywordMap)) {
      if (lowerQuestion.includes(keyword)) return iconType;
    }

    return "default";
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {faqs.map((faq, index) => {
            const iconType = getIconType(faq.question, index);
            const iconConfig = iconMap[iconType] || iconMap.default;
            const IconComponent = iconConfig.icon;

            return (
              <Card
                key={faq.id}
                className="bg-card-light dark:bg-card-dark group gap-0 border-0 py-0 transition-shadow duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconConfig.bg} flex-shrink-0`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${iconConfig.color}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-text-light-heading dark:text-text-dark-heading mt-2 text-lg font-semibold">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div
                    className={`transition-all duration-300 ${
                      expandedCard === faq.id
                        ? "max-h-96 opacity-100"
                        : "max-h-20 opacity-60"
                    } overflow-hidden`}
                  >
                    <p className="text-text-light-body dark:text-text-dark-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
