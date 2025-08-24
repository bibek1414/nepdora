import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Heart,
  ExternalLink,
  Edit,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FooterData, SocialLink } from "@/types/owner-site/components/footer";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";

interface FooterStyle2Props {
  footerData: FooterData;
  isEditable?: boolean;
  onEditClick?: () => void;
}

// Icon mapping to resolve serialized icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
};

// Helper function to render social icons with proper fallback
const renderSocialIcon = (social: SocialLink) => {
  // First, try to get the icon from the mapping based on platform name
  const IconFromMap = iconMap[social.platform];
  if (IconFromMap) {
    return <IconFromMap className="h-4 w-4" />;
  }

  // If the icon is a proper React component (function), use it directly
  if (typeof social.icon === "function") {
    const IconComponent = social.icon;
    return <IconComponent className="h-4 w-4" />;
  }

  // Fallback to a default icon if nothing else works
  return <Facebook className="h-4 w-4" />;
};

export function FooterStyle2({
  footerData,
  isEditable,
  onEditClick,
}: FooterStyle2Props) {
  const [email, setEmail] = useState("");
  const deleteFooterMutation = useDeleteFooterMutation();

  const handleLinkClick = (href: string | undefined, e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      return;
    }
    if (href.includes("/preview?")) {
      e.preventDefault();
      window.location.href = href;
    }
  };

  const handleDelete = () => {
    deleteFooterMutation.mutate();
  };

  return (
    <div className="group relative">
      {isEditable && (
        <div className="bg-background/80 absolute top-4 right-4 z-20 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={onEditClick}
            className="shadow-sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Footer
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteFooterMutation.isPending}
            className="shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <footer className="bg-muted/50 border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Main Content Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Company Section */}
                <div className="lg:col-span-1">
                  <Badge variant="secondary" className="mb-4">
                    {footerData.companyName}
                  </Badge>
                  <p className="text-muted-foreground mb-6">
                    {footerData.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2">
                    {footerData.socialLinks.map(social => (
                      <Button
                        key={social.id}
                        variant="outline"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={e => handleLinkClick(social.href, e)}
                      >
                        {renderSocialIcon(social)}
                        <span className="ml-2">{social.platform}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:col-span-2">
                  {footerData.sections.map(section => (
                    <div key={section.id}>
                      <h4 className="text-foreground mb-4 flex items-center font-semibold">
                        {section.title}
                        <ExternalLink className="text-muted-foreground ml-2 h-3 w-3" />
                      </h4>
                      <ul className="space-y-3">
                        {section.links.map(link => (
                          <li key={link.id}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground h-auto justify-start p-0 font-normal"
                              onClick={e => handleLinkClick(link.href, e)}
                            >
                              {link.text}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Card */}
          {footerData.newsletter.enabled && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-foreground mb-2 font-semibold">
                      {footerData.newsletter.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {footerData.newsletter.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="flex-1"
                      disabled={isEditable}
                    />
                    <Button variant="default" disabled={isEditable}>
                      Subscribe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Info Card */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 items-center gap-6 text-center md:grid-cols-3 md:text-left">
                {footerData.contactInfo.email && (
                  <div className="flex items-center justify-center md:justify-start">
                    <Mail className="text-primary mr-2 h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      {footerData.contactInfo.email}
                    </span>
                  </div>
                )}
                {footerData.contactInfo.phone && (
                  <div className="flex items-center justify-center md:justify-start">
                    <Phone className="text-primary mr-2 h-4 w-4" />
                    <span className="text-muted-foreground text-sm">
                      {footerData.contactInfo.phone}
                    </span>
                  </div>
                )}
                <div className="text-center md:text-right">
                  <p className="text-muted-foreground flex items-center justify-center gap-1 text-sm md:justify-end">
                    {footerData.copyright}
                    <Heart className="h-3 w-3 text-red-500" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  );
}
