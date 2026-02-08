import React from "react";
import { Button } from "@/components/ui/site-owners/button";
import {
  Plus,
  Sparkles,
  Info,
  Users,
  MessageSquareQuote,
  ShoppingBag,
  Rss,
  Mail,
  CircleHelp,
  Grid3X3,
  FolderTree,
} from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any;
}

export const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryActions = [],
  theme,
}) => {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-4 w-fit rounded-full bg-gray-100 p-4">
        <Icon className="h-8 w-8" />
      </div>
      <h4
        className="text-foreground mb-2 text-lg font-semibold"
        style={{ fontFamily: theme?.fonts?.heading }}
      >
        {title}
      </h4>
      <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
        {description}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            variant="default"
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
            variant="outline"
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
  hasCategories: boolean;
  hasSubCategories: boolean;
  hasBlog: boolean;
  hasContact: boolean;
  hasFAQ: boolean;
  pageComponentsLength: number;
  droppedComponentsLength: number;
  onAddHero?: () => void;
  onAddAboutUs?: () => void;
  onAddTeam?: () => void;
  onAddTestimonials?: () => void;
  onAddProducts?: () => void;
  onAddCategories?: () => void;
  onAddSubCategories?: () => void;
  onAddBlog?: () => void;
  onAddContact?: () => void;
  onAddFAQ?: () => void;
  onAddSection: () => void; // Add this prop
}

export const PlaceholderManager: React.FC<PlaceholderManagerProps> = ({
  isLoading,
  navbar,
  hasHero,
  hasAbout,
  hasTeam,
  hasTestimonials,
  hasProducts,
  hasCategories,
  hasSubCategories,
  hasBlog,
  hasContact,
  hasFAQ,
  pageComponentsLength,
  droppedComponentsLength,
  onAddHero,
  onAddAboutUs,
  onAddTeam,
  onAddTestimonials,
  onAddProducts,
  onAddCategories,
  onAddSubCategories,
  onAddBlog,
  onAddContact,
  onAddFAQ,
  onAddSection, // Add this
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  if (isLoading) return null;

  // Add a new condition for empty state that opens the add section dialog
  if (!navbar && pageComponentsLength === 0 && droppedComponentsLength === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Sparkles
            className="h-12 w-12"
            style={{ color: theme.colors.primary }}
          />
        </div>
        <h3
          className="text-foreground mb-2 text-xl font-semibold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Start Building Your Site
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Click below to open the component library and add your first section.
        </p>
        <Button onClick={onAddSection} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Open Component Library
        </Button>
      </div>
    );
  }

  if (
    !hasHero &&
    navbar &&
    pageComponentsLength === 0 &&
    droppedComponentsLength === 0 &&
    onAddHero
  ) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Sparkles
            className="h-12 w-12"
            style={{ color: theme.colors.primary }}
          />
        </div>
        <h3
          className="text-foreground mb-2 text-xl font-semibold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Add Your First Hero Section
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Create an engaging hero section to welcome your visitors and showcase
          what you offer.
        </p>
        <div className="flex gap-3">
          <Button onClick={onAddHero} variant="default" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Hero Section
          </Button>
          <Button onClick={onAddSection} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Browse All Components
          </Button>
        </div>
      </div>
    );
  }

  // Rest of your existing conditions with added onAddSection to secondary actions
  if (
    hasHero &&
    !hasAbout &&
    !hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
    !hasBlog &&
    !hasTeam &&
    !hasTestimonials
  ) {
    const secondaryActions: PlaceholderAction[] = [
      {
        label: "Browse All Components",
        icon: Plus,
        onClick: onAddSection,
      },
    ];

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
    if (onAddCategories) {
      secondaryActions.push({
        label: "Add Categories",
        icon: Grid3X3,
        onClick: onAddCategories,
      });
    }
    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
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
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Info}
        title="Tell Your Story"
        description="Add content sections to showcase your company and build trust with visitors."
        primaryAction={
          onAddAboutUs
            ? { label: "Add About Us", icon: Plus, onClick: onAddAboutUs }
            : undefined
        }
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    !hasTestimonials &&
    !hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
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
    if (onAddCategories) {
      secondaryActions.push({
        label: "Add Categories",
        icon: Grid3X3,
        onClick: onAddCategories,
      });
    }
    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
      });
    }
    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
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
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    hasTeam &&
    !hasTestimonials &&
    !hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
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
    if (onAddCategories) {
      secondaryActions.push({
        label: "Add Categories",
        icon: Grid3X3,
        onClick: onAddCategories,
      });
    }
    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
      });
    }
    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
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
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    !hasTeam &&
    !hasTestimonials &&
    !hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
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
    if (onAddCategories) {
      secondaryActions.push({
        label: "Add Categories",
        icon: Grid3X3,
        onClick: onAddCategories,
      });
    }
    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
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
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    hasTeam &&
    hasTestimonials &&
    !hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
    !hasBlog &&
    onAddProducts
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddCategories) {
      secondaryActions.push({
        label: "Add Categories",
        icon: Grid3X3,
        onClick: onAddCategories,
      });
    }
    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
      });
    }
    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
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
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
    !hasBlog &&
    onAddCategories
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
      });
    }
    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Grid3X3}
        title="Organize with Categories"
        description="Help visitors navigate your offerings by organizing them into clear categories."
        primaryAction={{
          label: "Add Categories Section",
          icon: Plus,
          onClick: onAddCategories,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    hasProducts &&
    hasCategories &&
    !hasSubCategories &&
    !hasBlog &&
    onAddSubCategories
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={FolderTree}
        title="Add Detailed Organization"
        description="Provide even more detailed organization with subcategories to help visitors find exactly what they need."
        primaryAction={{
          label: "Add Subcategories Section",
          icon: Plus,
          onClick: onAddSubCategories,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    hasTestimonials &&
    !hasProducts &&
    !hasCategories &&
    !hasSubCategories &&
    !hasBlog &&
    onAddCategories
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddProducts) {
      secondaryActions.push({
        label: "Add Products",
        icon: ShoppingBag,
        onClick: onAddProducts,
      });
    }
    if (onAddSubCategories) {
      secondaryActions.push({
        label: "Add Subcategories",
        icon: FolderTree,
        onClick: onAddSubCategories,
      });
    }
    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Grid3X3}
        title="Organize Your Content"
        description="Help visitors navigate by organizing your content into clear, easy-to-browse categories."
        primaryAction={{
          label: "Add Categories Section",
          icon: Plus,
          onClick: onAddCategories,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    (hasTestimonials || hasTeam) &&
    !hasSubCategories &&
    !hasBlog &&
    onAddSubCategories
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddProducts && !hasProducts) {
      secondaryActions.push({
        label: "Add Products",
        icon: ShoppingBag,
        onClick: onAddProducts,
      });
    }
    if (onAddCategories && !hasCategories) {
      secondaryActions.push({
        label: "Add Categories",
        icon: Grid3X3,
        onClick: onAddCategories,
      });
    }
    if (onAddBlog) {
      secondaryActions.push({
        label: "Add Blog",
        icon: Rss,
        onClick: onAddBlog,
      });
    }
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={FolderTree}
        title="Add Detailed Navigation"
        description="Create subcategories to provide detailed organization and help visitors find specific content quickly."
        primaryAction={{
          label: "Add Subcategories Section",
          icon: Plus,
          onClick: onAddSubCategories,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    (hasTeam || hasTestimonials) &&
    (hasProducts || hasCategories || hasSubCategories) &&
    !hasBlog &&
    onAddBlog
  ) {
    const secondaryActions: PlaceholderAction[] = [];
    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Rss}
        title="Share Your Stories"
        description="Add a blog section to keep your audience informed and engaged with fresh content."
        primaryAction={{
          label: "Add Blog Section",
          icon: Plus,
          onClick: onAddBlog,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    (hasProducts || hasCategories || hasSubCategories) &&
    !hasBlog &&
    onAddBlog
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Rss}
        title="Keep Your Audience Engaged"
        description="Add a blog to share updates, insights, and keep customers coming back for more."
        primaryAction={{
          label: "Add Blog Section",
          icon: Plus,
          onClick: onAddBlog,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    (hasProducts ||
      hasCategories ||
      hasSubCategories ||
      hasBlog ||
      hasTestimonials ||
      hasTeam) &&
    !hasFAQ &&
    onAddFAQ
  ) {
    return (
      <ContentPlaceholder
        icon={CircleHelp}
        title="Answer Common Questions"
        description="Help visitors find quick answers and reduce support requests by adding an FAQ section."
        primaryAction={{
          label: "Add FAQ Section",
          icon: Plus,
          onClick: onAddFAQ,
        }}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    (hasTeam || hasTestimonials) &&
    (hasProducts || hasCategories || hasSubCategories) &&
    (hasBlog || hasFAQ) &&
    !hasContact &&
    onAddContact
  ) {
    const secondaryActions: PlaceholderAction[] = [];
    if (onAddFAQ && !hasFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Mail}
        title="Add Contact Form"
        description="Let visitors easily get in touch with you through a professional contact form."
        primaryAction={{
          label: "Add Contact Section",
          icon: Plus,
          onClick: onAddContact,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (
    hasHero &&
    hasAbout &&
    (hasProducts || hasCategories || hasSubCategories || hasBlog) &&
    !hasContact &&
    onAddContact
  ) {
    const secondaryActions: PlaceholderAction[] = [];

    if (onAddFAQ && !hasFAQ) {
      secondaryActions.push({
        label: "Add FAQ",
        icon: CircleHelp,
        onClick: onAddFAQ,
      });
    }

    return (
      <ContentPlaceholder
        icon={Mail}
        title="Complete Your Site"
        description="Finish with a contact form so visitors can easily reach out to you for inquiries."
        primaryAction={{
          label: "Add Contact Section",
          icon: Plus,
          onClick: onAddContact,
        }}
        secondaryActions={secondaryActions}
        theme={theme}
      />
    );
  }

  if (!navbar && pageComponentsLength === 0 && droppedComponentsLength === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Sparkles
            className="h-12 w-12"
            style={{ color: theme.colors.primary }}
          />
        </div>
        <h3
          className="text-foreground mb-2 text-xl font-semibold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          Start Building Your Site
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Add a navbar first, then create a compelling hero section to capture
          your visitors&apos; attention.
        </p>
      </div>
    );
  }

  if (pageComponentsLength === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Sparkles
            className="h-12 w-12"
            style={{ color: theme.colors.primary }}
          />
        </div>
        <h3
          className="text-foreground mb-2 text-xl font-semibold"
          style={{ fontFamily: theme.fonts.heading }}
        >
          No Sections Added Yet
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start building your page by adding your first section from the
          component library.
        </p>
        <Button onClick={onAddSection} variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Section
        </Button>
      </div>
    );
  }

  return null;
};
