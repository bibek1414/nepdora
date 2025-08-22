import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { FooterStyle1 } from "./footer-style1";
import { FooterStyle2 } from "./footer-style2";
import { FooterData } from "@/types/owner-site/components/footer";

interface FooterStyle {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{
    footerData: FooterData;
    isEditable?: boolean;
  }>;
}

interface FooterStylesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStyleSelect: (style: string) => void;
  sampleFooterData?: FooterData;
}

const DraggableFooterPreview = ({
  id,
  styleName,
  children,
}: {
  id: string;
  styleName: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: {
        type: "footer",
        style: styleName,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden rounded-lg border ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {/* Footer Preview */}
      <div className="bg-white">
        <div className="">{children}</div>
      </div>
    </div>
  );
};

// Sample footer data for preview
const getSampleFooterData = (): FooterData => ({
  companyName: "Your Company",
  style: "style-1",
  description:
    "Building amazing experiences with cutting-edge technology and innovative solutions for businesses worldwide.",
  contactInfo: {
    email: "hello@yourcompany.com",
    phone: "+977 1234567890",
    address: "123 Business Street, Kathmandu, Nepal",
  },
  socialLinks: [
    {
      id: "1",
      platform: "Facebook",
      href: "https://facebook.com",
      icon: () => null,
    },
    {
      id: "2",
      platform: "Twitter",
      href: "https://twitter.com",
      icon: () => null,
    },
    {
      id: "3",
      platform: "LinkedIn",
      href: "https://linkedin.com",
      icon: () => null,
    },
  ],
  sections: [
    {
      id: "1",
      title: "Company",
      links: [
        { id: "1", text: "About Us", href: "/about" },
        { id: "2", text: "Careers", href: "/careers" },
        { id: "3", text: "Contact", href: "/contact" },
      ],
    },
    {
      id: "2",
      title: "Services",
      links: [
        { id: "1", text: "Web Design", href: "/web-design" },
        { id: "2", text: "Development", href: "/development" },
        { id: "3", text: "Support", href: "/support" },
      ],
    },
  ],
  newsletter: {
    enabled: true,
    title: "Stay Updated",
    description:
      "Subscribe to our newsletter for the latest updates and insights.",
  },
  copyright: "© 2025 Your Company. All rights reserved.",
});

const footerStyles: FooterStyle[] = [
  {
    id: "style-1",
    name: "Clean & Minimal",
    description:
      "Traditional footer layout with clean typography and organized sections",
    component: FooterStyle1,
  },
  {
    id: "style-2",
    name: "Card-Based Modern",
    description:
      "Modern card-based design with visual separation and contemporary styling",
    component: FooterStyle2,
  },
];

export const FooterStylesDialog: React.FC<FooterStylesDialogProps> = ({
  open,
  onOpenChange,
  onStyleSelect,
  sampleFooterData,
}) => {
  const footerData = sampleFooterData || getSampleFooterData();

  const handleStyleClick = (style: string, event: React.MouseEvent) => {
    if (!event.defaultPrevented) {
      onStyleSelect(style);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            Choose Footer Style
          </DialogTitle>
          <p className="mt-1 text-sm text-gray-600">
            Select a footer style or drag to add to your page
          </p>
        </DialogHeader>

        <div className="space-y-8">
          {footerStyles.map(footerStyle => {
            const FooterComponent = footerStyle.component;
            return (
              <div key={footerStyle.id} className="space-y-4">
                {/* Style Info */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{footerStyle.name}</h3>
                  <p className="text-sm text-gray-600">
                    {footerStyle.description}
                  </p>
                </div>

                {/* Footer Preview */}
                <div
                  onClick={e => handleStyleClick(footerStyle.id, e)}
                  className="cursor-pointer"
                >
                  <DraggableFooterPreview
                    id={`footer-${footerStyle.id}`}
                    styleName={footerStyle.id}
                  >
                    <FooterComponent
                      footerData={footerData}
                      isEditable={false}
                    />
                  </DraggableFooterPreview>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
