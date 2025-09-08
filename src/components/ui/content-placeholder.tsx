import React from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Sparkles,
  Info,
  Users,
  MessageSquareQuote,
  ShoppingBag,
  Rss,
  Mail,
} from "lucide-react";

interface PlaceholderAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "outline";
}

interface ContentPlaceholderProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  primaryAction?: PlaceholderAction;
  secondaryActions?: PlaceholderAction[];
}

export const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryActions = [],
}) => {
  return (
    <div className="py-20 text-center">
      <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
        <Icon className="text-primary h-8 w-8" />
      </div>
      <h4 className="text-foreground mb-2 text-lg font-semibold">{title}</h4>
      <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
        {description}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            variant={primaryAction.variant || "default"}
            className="gap-2"
          >
            <primaryAction.icon className="h-4 w-4" />
            {primaryAction.label}
          </Button>
        )}
        {secondaryActions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant || "outline"}
            className="gap-2"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

interface PlaceholderManagerProps {
  isLoading: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  navbar?: any;
  hasHero: boolean;
  hasAbout: boolean;
  hasTeam: boolean;
  hasTestimonials: boolean;
  hasProducts: boolean;
  hasBlog: boolean;
  hasContact: boolean;
  pageComponentsLength: number;
  droppedComponentsLength: number;
  onAddHero?: () => void;
  onAddAboutUs?: () => void;
  onAddTeam?: () => void;
  onAddTestimonials?: () => void;
  onAddProducts?: () => void;
  onAddBlog?: () => void;
  onAddContact?: () => void;
}

export const PlaceholderManager: React.FC<PlaceholderManagerProps> = ({
  isLoading,
  navbar,
  hasHero,
  hasAbout,
  hasTeam,
  hasTestimonials,
  hasProducts,
  hasBlog,
  hasContact,
  pageComponentsLength,
  droppedComponentsLength,
  onAddHero,
  onAddAboutUs,
  onAddTeam,
  onAddTestimonials,
  onAddProducts,
  onAddBlog,
  onAddContact,
}) => {
  // Don't show placeholders while loading
  if (isLoading) return null;

  // 1. Show initial hero placeholder if no hero and navbar exists
  if (
    !hasHero &&
    navbar &&
    pageComponentsLength === 0 &&
    droppedComponentsLength === 0 &&
    onAddHero
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="bg-primary/10 mb-4 rounded-full p-6">
          <Sparkles className="text-primary h-12 w-12" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">
          Add Your First Hero Section
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create an engaging hero section to welcome your visitors and showcase
          what you offer.
        </p>
        <Button onClick={onAddHero} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Hero Section
        </Button>
      </div>
    );
  }

  // 2. Show initial options after hero
  if (
    hasHero &&
    !hasAbout &&
    !hasProducts &&
    !hasBlog &&
    !hasTeam &&
    !hasTestimonials
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddTeam) {
      secondaryActions.push({
        label: "Add Team",
        icon: Users,
        onClick: onAddTeam,
      });
    }

    if (onAddTestimonials) {
      secondaryActions.push({
        label: "Add Testimonials",
        icon: MessageSquareQuote,
        onClick: onAddTestimonials,
      });
    }

    if (onAddProducts) {
      secondaryActions.push({
        label: "Add Products",
        icon: ShoppingBag,
        onClick: onAddProducts,
      });
    }

    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }

    if (onAddContact) {
      secondaryActions.push({
        label: "Add Contact",
        icon: Mail,
        onClick: onAddContact,
      });
    }

    return (
      <ContentPlaceholder
        icon={Info}
        title="Tell Your Story"
        description="Add content sections to showcase your company and build trust with visitors."
        primaryAction={
          onAddAboutUs
            ? {
                label: "Add About Us",
                icon: Plus,
                onClick: onAddAboutUs,
              }
            : undefined
        }
        secondaryActions={secondaryActions}
      />
    );
  }

  // 3. Show team placeholder after about us
  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    !hasTestimonials &&
    !hasProducts &&
    !hasBlog &&
    onAddTeam
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddTestimonials) {
      secondaryActions.push({
        label: "Add Testimonials",
        icon: MessageSquareQuote,
        onClick: onAddTestimonials,
      });
    }

    if (onAddProducts) {
      secondaryActions.push({
        label: "Add Products",
        icon: ShoppingBag,
        onClick: onAddProducts,
      });
    }

    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }

    return (
      <ContentPlaceholder
        icon={Users}
        title="Showcase Your Team"
        description="Introduce your team members to build trust and connect with your audience."
        primaryAction={{
          label: "Add Team Section",
          icon: Plus,
          onClick: onAddTeam,
        }}
        secondaryActions={secondaryActions}
      />
    );
  }

  // 4. Show testimonials placeholder after team
  if (
    hasHero &&
    hasAbout &&
    hasTeam &&
    !hasTestimonials &&
    !hasProducts &&
    !hasBlog &&
    onAddTestimonials
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddProducts) {
      secondaryActions.push({
        label: "Add Products",
        icon: ShoppingBag,
        onClick: onAddProducts,
      });
    }

    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }

    return (
      <ContentPlaceholder
        icon={MessageSquareQuote}
        title="Show Customer Love"
        description="Display testimonials and reviews to build credibility and trust with potential customers."
        primaryAction={{
          label: "Add Testimonials",
          icon: Plus,
          onClick: onAddTestimonials,
        }}
        secondaryActions={secondaryActions}
      />
    );
  }

  // 5. Alternative testimonials placeholder - after about but no team
  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    !hasTestimonials &&
    !hasProducts &&
    !hasBlog &&
    onAddTestimonials
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddTeam) {
      secondaryActions.push({
        label: "Add Team",
        icon: Users,
        onClick: onAddTeam,
      });
    }

    if (onAddProducts) {
      secondaryActions.push({
        label: "Add Products",
        icon: ShoppingBag,
        onClick: onAddProducts,
      });
    }

    return (
      <ContentPlaceholder
        icon={MessageSquareQuote}
        title="Build Trust with Testimonials"
        description="Let your customers speak for you. Add testimonials to build credibility and showcase your success."
        primaryAction={{
          label: "Add Testimonials",
          icon: Plus,
          onClick: onAddTestimonials,
        }}
        secondaryActions={secondaryActions}
      />
    );
  }

  // 6. Show products placeholder after testimonials
  if (
    hasHero &&
    hasAbout &&
    hasTeam &&
    hasTestimonials &&
    !hasProducts &&
    !hasBlog &&
    onAddProducts
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }

    return (
      <ContentPlaceholder
        icon={ShoppingBag}
        title="Showcase Your Products"
        description="Display your products in an attractive grid or list layout to attract customers."
        primaryAction={{
          label: "Add Products Section",
          icon: Plus,
          onClick: onAddProducts,
        }}
        secondaryActions={secondaryActions}
      />
    );
  }

  // 7. Alternative products placeholder - without team but with testimonials
  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    hasTestimonials &&
    !hasProducts &&
    !hasBlog &&
    onAddProducts
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }

    return (
      <ContentPlaceholder
        icon={ShoppingBag}
        title="Feature Your Products"
        description="Now that you've built trust with testimonials, showcase what you're selling."
        primaryAction={{
          label: "Add Products Section",
          icon: Plus,
          onClick: onAddProducts,
        }}
        secondaryActions={secondaryActions}
      />
    );
  }

  // 8. Show blog placeholder after all main sections
  if (
    hasHero &&
    hasAbout &&
    hasTeam &&
    hasTestimonials &&
    hasProducts &&
    !hasBlog &&
    onAddBlog
  ) {
    return (
      <ContentPlaceholder
        icon={Rss}
        title="Share Your Stories"
        description="Add a blog section to keep your audience informed and engaged."
        primaryAction={{
          label: "Add Blog Section",
          icon: Plus,
          onClick: onAddBlog,
        }}
      />
    );
  }

  // 9. Alternative blog placeholder - without team but with testimonials and products
  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    hasTestimonials &&
    hasProducts &&
    !hasBlog &&
    onAddBlog
  ) {
    return (
      <ContentPlaceholder
        icon={Rss}
        title="Keep Your Audience Engaged"
        description="Add a blog to share updates, insights, and keep customers coming back."
        primaryAction={{
          label: "Add Blog Section",
          icon: Plus,
          onClick: onAddBlog,
        }}
      />
    );
  }

  // 10. Show contact placeholder after all sections
  if (
    hasHero &&
    hasAbout &&
    hasTeam &&
    hasTestimonials &&
    hasProducts &&
    hasBlog &&
    !hasContact &&
    onAddContact
  ) {
    return (
      <ContentPlaceholder
        icon={Mail}
        title="Add Contact Form"
        description="Let visitors easily get in touch with you through a contact form."
        primaryAction={{
          label: "Add Contact Section",
          icon: Plus,
          onClick: onAddContact,
        }}
      />
    );
  }

  // 11. Alternative contact placeholder - without team but with other sections
  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    hasTestimonials &&
    hasProducts &&
    hasBlog &&
    !hasContact &&
    onAddContact
  ) {
    return (
      <ContentPlaceholder
        icon={Mail}
        title="Complete Your Site"
        description="Finish with a contact form so visitors can easily reach out to you."
        primaryAction={{
          label: "Add Contact Section",
          icon: Plus,
          onClick: onAddContact,
        }}
      />
    );
  }

  // 12. Show general start building message if no navbar
  if (!navbar && pageComponentsLength === 0 && droppedComponentsLength === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="bg-primary/10 mb-4 rounded-full p-6">
          <Sparkles className="text-primary h-12 w-12" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-semibold">
          Start Building Your Site
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Add a navbar first, then create a compelling hero section to capture
          your visitors&apos; attention.
        </p>
      </div>
    );
  }

  // No placeholder needed
  return null;
};
