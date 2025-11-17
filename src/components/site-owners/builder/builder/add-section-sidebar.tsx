"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  X,
  LayoutDashboard,
  Crown,
  Info,
  Menu,
  Package,
  Mail,
  Quote,
  FileText,
  ImageIcon,
  FolderOpen,
  Tag,
  ChevronRight,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComponentClick: (componentId: string, template?: string) => void;
}

type ComponentItem = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  keywords?: string[];
  description?: string;
  hasTemplates?: boolean;
  templates?: TemplateItem[];
  popular?: boolean;
};

type TemplateItem = {
  id: string;
  name: string;
  image: string;
  description?: string;
};

export const AddSectionDialog: React.FC<AddSectionDialogProps> = ({
  open,
  onOpenChange,
  onComponentClick,
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const templates = {
    hero: [
      {
        id: "hero-1",
        name: "Hero Style 1",
        image: "/images/site-owners/hero/hero1.png",
      },
      {
        id: "hero-2",
        name: "Hero Style 2",
        image: "/images/site-owners/hero/hero2.png",
      },
      {
        id: "hero-3",
        name: "Hero Style 3",
        image: "/images/site-owners/hero/hero3.png",
      },
      {
        id: "hero-4",
        name: "Hero Style 4",
        image: "/images/site-owners/hero/hero4.png",
      },
      {
        id: "hero-5",
        name: "Hero Style 5",
        image: "/images/site-owners/hero/hero5.png",
      },
      {
        id: "hero-6",
        name: "Hero Style 6",
        image: "/images/site-owners/hero/hero6.png",
      },
      {
        id: "hero-7",
        name: "Hero Style 7",
        image: "/images/site-owners/hero/hero7.png",
      },
      {
        id: "hero-8",
        name: "Hero Style 8",
        image: "/images/site-owners/hero/hero8.png",
      },
      {
        id: "hero-9",
        name: "Hero Style 9",
        image: "/images/site-owners/hero/hero9.png",
      },
      {
        id: "hero-10",
        name: "Hero Style 10",
        image: "/images/site-owners/hero/hero10.png",
      },
    ],
    about: [
      {
        id: "about-1",
        name: "About Style 1",
        image: "/images/site-owners/about/about1.png",
      },
      {
        id: "about-2",
        name: "About Style 2",
        image: "/images/site-owners/about/about2.png",
      },
      {
        id: "about-3",
        name: "About Style 3",
        image: "/images/site-owners/about/about3.png",
      },
      {
        id: "about-4",
        name: "About Style 4",
        image: "/images/site-owners/about/about4.png",
      },
      {
        id: "about-5",
        name: "About Style 5",
        image: "/images/site-owners/about/about5.png",
      },
      {
        id: "about-6",
        name: "About Style 6",
        image: "/images/site-owners/about/about6.png",
      },
      {
        id: "about-7",
        name: "About Style 7",
        image: "/images/site-owners/about/about7.png",
      },
      {
        id: "about-8",
        name: "About Style 8",
        image: "/images/site-owners/about/about8.png",
      },
    ],
    products: [
      {
        id: "product-1",
        name: "Product Grid 1",
        image: "/images/site-owners/products/product1.png",
      },
      {
        id: "product-2",
        name: "Product Grid 2",
        image: "/images/site-owners/products/product2.png",
      },
      {
        id: "product-3",
        name: "Product List",
        image: "/images/site-owners/products/product3.png",
      },
      {
        id: "product-4",
        name: "Product Style 4",
        image: "/images/site-owners/products/product4.png",
      },
      {
        id: "product-5",
        name: "Product Style 5",
        image: "/images/site-owners/products/product5.png",
      },
      {
        id: "product-6",
        name: "Product Style 6",
        image: "/images/site-owners/products/product6.png",
      },
    ],
    category: [
      {
        id: "category-1",
        name: "Category Grid 1",
        image: "/images/site-owners/categories/category1.png",
      },
      {
        id: "category-2",
        name: "Category Grid 2",
        image: "/images/site-owners/categories/category2.png",
      },
      {
        id: "category-3",
        name: "Category List",
        image: "/images/site-owners/categories/category3.png",
      },
      {
        id: "category-4",
        name: "Category Style 4",
        image: "/images/site-owners/categories/category4.png",
      },
      {
        id: "category-5",
        name: "Category Style 5",
        image: "/images/site-owners/categories/category5.png",
      },
    ],
    subcategory: [
      {
        id: "subcategory-1",
        name: "SubCategory Grid 1",
        image: "/images/site-owners/subcategories/subcategory1.png",
      },
      {
        id: "subcategory-2",
        name: "SubCategory Grid 2",
        image: "/images/site-owners/subcategories/subcategory2.png",
      },
      {
        id: "subcategory-3",
        name: "SubCategory List",
        image: "/images/site-owners/subcategories/subcategory3.png",
      },
    ],
    services: [
      {
        id: "services-1",
        name: "Services Grid 1",
        image: "/images/site-owners/services/services-1.png",
      },
      {
        id: "services-2",
        name: "Services Grid 2",
        image: "/images/site-owners/services/services-2.png",
      },
      {
        id: "services-3",
        name: "Services List",
        image: "/images/site-owners/services/services-3.png",
      },
      {
        id: "services-4",
        name: "Services Style 4",
        image: "/images/site-owners/services/services-4.png",
      },
    ],
    contact: [
      {
        id: "contact-1",
        name: "Contact Form 1",
        image: "/images/site-owners/contact/contact1.png",
      },
      {
        id: "contact-2",
        name: "Contact Form 2",
        image: "/images/site-owners/contact/contact2.png",
      },
      {
        id: "contact-3",
        name: "Contact Form 3",
        image: "/images/site-owners/contact/contact3.png",
      },
      {
        id: "contact-4",
        name: "Contact Form 4",
        image: "/images/site-owners/contact/contact4.png",
      },
    ],
    testimonials: [
      {
        id: "testimonial-1",
        name: "Testimonials Grid",
        image: "/images/site-owners/testimonials/testimonial1.png",
      },
      {
        id: "testimonial-2",
        name: "Testimonials Carousel",
        image: "/images/site-owners/testimonials/testimonial2.png",
      },
      {
        id: "testimonial-3",
        name: "Testimonials Cards",
        image: "/images/site-owners/testimonials/testimonial3.png",
      },
      {
        id: "testimonial-4",
        name: "Testimonials Style 4",
        image: "/images/site-owners/testimonials/testimonial4.png",
      },
      {
        id: "testimonial-5",
        name: "Testimonials Style 5",
        image: "/images/site-owners/testimonials/testimonial5.png",
      },
      {
        id: "testimonial-6",
        name: "Testimonials Style 6",
        image: "/images/site-owners/testimonials/testimonial6.png",
      },
      {
        id: "testimonial-7",
        name: "Testimonials Style 7",
        image: "/images/site-owners/testimonials/testimonial7.png",
      },
    ],
    team: [
      {
        id: "team-1",
        name: "Team Grid",
        image: "/images/site-owners/team/team1.png",
      },
      {
        id: "team-2",
        name: "Team Cards",
        image: "/images/site-owners/team/team2.png",
      },
      {
        id: "team-3",
        name: "Team List",
        image: "/images/site-owners/team/team3.png",
      },
    ],
    gallery: [
      {
        id: "gallery-1",
        name: "Gallery Grid",
        image: "/images/site-owners/gallery/gallery1.png",
      },
      {
        id: "gallery-2",
        name: "Gallery Masonry",
        image: "/images/site-owners/gallery/gallery2.png",
      },
      {
        id: "gallery-3",
        name: "Gallery Carousel",
        image: "/images/site-owners/gallery/gallery3.png",
      },
      {
        id: "gallery-4",
        name: "Gallery Style 4",
        image: "/images/site-owners/gallery/gallery4.png",
      },
      {
        id: "gallery-5",
        name: "Gallery Style 5",
        image: "/images/site-owners/gallery/gallery5.png",
      },
    ],
    banner: [
      {
        id: "banner-1",
        name: "Banner Style 1",
        image: "/images/site-owners/banner/banner1.png",
      },
      {
        id: "banner-2",
        name: "Banner Style 2",
        image: "/images/site-owners/banner/banner2.png",
      },
      {
        id: "banner-3",
        name: "Banner Style 3",
        image: "/images/site-owners/banner/banner3.png",
      },
      {
        id: "banner-4",
        name: "Banner Style 4",
        image: "/images/site-owners/banner/banner4.png",
      },
    ],
    blog: [
      {
        id: "blog-1",
        name: "Blog Style 1",
        image: "/images/site-owners/blogs/blog1.png",
      },
      {
        id: "blog-2",
        name: "Blog Style 2",
        image: "/images/site-owners/blogs/blog2.png",
      },
      {
        id: "blog-3",
        name: "Blog Style 3",
        image: "/images/site-owners/blogs/blog3.png",
      },
    ],
    faq: [
      {
        id: "faq-1",
        name: "FAQ Style 1",
        image: "/images/site-owners/faq/faq-1.png",
      },
      {
        id: "faq-2",
        name: "FAQ Style 2",
        image: "/images/site-owners/faq/faq-2.png",
      },
      {
        id: "faq-3",
        name: "FAQ Style 3",
        image: "/images/site-owners/faq/faq-3.png",
      },
      {
        id: "faq-4",
        name: "FAQ Style 4",
        image: "/images/site-owners/faq/faq-4.png",
      },
      {
        id: "faq-5",
        name: "FAQ Style 5",
        image: "/images/site-owners/faq/faq-5.png",
      },
    ],
    portfolio: [
      {
        id: "portfolio-1",
        name: "Portfolio Style 1",
        image: "/images/site-owners/portfolio/portfolio1.png",
      },
      {
        id: "portfolio-2",
        name: "Portfolio Style 2",
        image: "/images/site-owners/portfolio/portfolio2.png",
      },
      {
        id: "portfolio-3",
        name: "Portfolio Style 3",
        image: "/images/site-owners/portfolio/portfolio3.png",
      },
      {
        id: "portfolio-4",
        name: "Portfolio Style 4",
        image: "/images/site-owners/portfolio/portfolio4.png",
      },
    ],
    newsletter: [
      {
        id: "newsletter-1",
        name: "Newsletter Style 1",
        image: "/images/site-owners/newsletter/newsletter1.png",
      },
      {
        id: "newsletter-2",
        name: "Newsletter Style 2",
        image: "/images/site-owners/newsletter/newsletter2.png",
      },
      {
        id: "newsletter-3",
        name: "Newsletter Style 3",
        image: "/images/site-owners/newsletter/newsletter3.png",
      },
    ],
    youtube: [
      {
        id: "youtube-1",
        name: "YouTube Style 1",
        image: "/images/site-owners/youtube/youtube-1.png",
      },
      {
        id: "youtube-2",
        name: "YouTube Style 2",
        image: "/images/site-owners/youtube/youtube-2.png",
      },
      {
        id: "youtube-3",
        name: "YouTube Style 3",
        image: "/images/site-owners/youtube/youtube-3.png",
      },
    ],
  };

  const components: ComponentItem[] = [
    {
      id: "hero-sections",
      label: "Hero Section",
      icon: Crown,
      keywords: ["banner", "top section", "intro"],
      hasTemplates: true,
      templates: templates.hero,
      popular: true,
    },
    {
      id: "about-sections",
      label: "About Us",
      icon: Info,
      keywords: ["company", "who we are"],
      hasTemplates: true,
      templates: templates.about,
      popular: true,
    },
    {
      id: "services-sections",
      label: "Services",
      icon: Menu,
      keywords: ["what we do", "features"],
      hasTemplates: true,
      templates: templates.services,
      popular: true,
    },
    {
      id: "products-sections",
      label: "Products",
      icon: Package,
      keywords: ["catalog", "shop"],
      hasTemplates: true,
      templates: templates.products,
      popular: true,
    },
    {
      id: "categories-sections",
      label: "Categories",
      icon: FolderOpen,
      keywords: ["category", "taxonomy", "organization"],
      hasTemplates: true,
      templates: templates.category,
    },
    {
      id: "subcategories-sections",
      label: "SubCategories",
      icon: Tag,
      keywords: ["subcategory", "nested"],
      hasTemplates: true,
      templates: templates.subcategory,
    },
    {
      id: "contact-sections",
      label: "Contact",
      icon: Mail,
      keywords: ["form", "email"],
      hasTemplates: true,
      templates: templates.contact,
    },
    {
      id: "testimonials-sections",
      label: "Testimonials",
      icon: Quote,
      keywords: ["reviews", "clients"],
      hasTemplates: true,
      templates: templates.testimonials,
    },
    {
      id: "team-members-sections",
      label: "Team Members",
      icon: Crown,
      keywords: ["employees", "staff"],
      hasTemplates: true,
      templates: templates.team,
    },
    {
      id: "gallery-sections",
      label: "Gallery",
      icon: ImageIcon,
      keywords: ["images", "photos"],
      hasTemplates: true,
      templates: templates.gallery,
    },
    {
      id: "banner-sections",
      label: "Banner",
      icon: ImageIcon,
      keywords: ["banner", "slider"],
      hasTemplates: true,
      templates: templates.banner,
    },
    {
      id: "blog-sections",
      label: "Blog",
      icon: FileText,
      keywords: ["articles", "posts"],
      hasTemplates: true,
      templates: templates.blog,
    },
    {
      id: "faq-sections",
      label: "FAQ",
      icon: Info,
      keywords: ["questions", "help"],
      hasTemplates: true,
      templates: templates.faq,
    },
    {
      id: "portfolio-sections",
      label: "Portfolio",
      icon: FolderOpen,
      keywords: ["projects", "work"],
      hasTemplates: true,
      templates: templates.portfolio,
    },
    {
      id: "newsletter-sections",
      label: "Newsletter",
      icon: Mail,
      keywords: ["subscribe", "email"],
      hasTemplates: true,
      templates: templates.newsletter,
    },
    {
      id: "youtube-sections",
      label: "YouTube",
      icon: ImageIcon,
      keywords: ["video", "embed"],
      hasTemplates: true,
      templates: templates.youtube,
    },
    {
      id: "policies-sections",
      label: "Policies",
      icon: FileText,
      keywords: ["return", "shipping", "privacy"],
      description: "Policy pages",
    },
    {
      id: "text-editor-sections",
      label: "Text Editor",
      icon: FileText,
      keywords: ["editor", "content"],
      description: "Custom text content",
    },
  ];

  const popularComponents = components.filter(comp => comp.popular);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return components;
    return components.filter(({ label, id, keywords }) => {
      const haystack = [label, id, ...(keywords ?? [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleTemplateSelect = (componentId: string, templateId: string) => {
    onComponentClick(componentId, templateId);
    handleClose();
  };

  const handleComponentSelect = (component: ComponentItem) => {
    if (component.hasTemplates && component.templates) {
      onComponentClick(component.id, component.templates[0].id);
    } else {
      onComponentClick(component.id);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setQuery("");
    onOpenChange(false);
  };

  const getCurrentTemplates = () => {
    if (!selectedCategory) {
      // Show popular components with their templates
      return popularComponents.map(component => ({
        component,
        templates: component.templates?.slice(0, 3) || [], // Show first 3 templates for each popular component
      }));
    }

    // Show all templates for selected category
    const component = components.find(comp => comp.id === selectedCategory);
    if (component?.templates) {
      return [
        {
          component,
          templates: component.templates,
        },
      ];
    }

    return [];
  };

  const currentTemplates = getCurrentTemplates();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="h-[80vh] !max-w-6xl overflow-hidden p-0">
        <div className="flex h-full overflow-hidden">
          {/* Left Sidebar - Components List */}
          <div className="flex h-full w-64 flex-col border-r">
            <DialogHeader className="border-b px-4 py-4">
              <DialogTitle className="text-lg font-semibold">
                Components
              </DialogTitle>
            </DialogHeader>

            {/* Search */}
            <div className="border-b px-4 py-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="h-9 pr-9 pl-9 text-sm"
                />
                {query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuery("")}
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Components List */}
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-2">
                {filtered.map(component => (
                  <button
                    key={component.id}
                    onClick={() => handleCategorySelect(component.id)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      selectedCategory === component.id
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <component.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate text-sm font-medium">
                      {component.label}
                    </span>

                    {component.hasTemplates && (
                      <ChevronRight className="ml-auto h-3 w-3 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Content Area - Templates Grid */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="h-full flex-1">
              <div className="p-6">
                {!selectedCategory ? (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Popular Components
                      </h2>
                      <p className="mt-1 text-gray-600">
                        Get started with these commonly used components
                      </p>
                    </div>

                    {/* Grid showing templates for each popular component */}
                    {currentTemplates.map(({ component, templates }) => (
                      <div key={component.id} className="mb-8">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                            <component.icon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {component.label}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {component.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {templates.map(template => (
                            <div
                              key={template.id}
                              className="group cursor-pointer"
                              onClick={() =>
                                handleTemplateSelect(component.id, template.id)
                              }
                            >
                              <div className="relative overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-blue-400 hover:shadow-lg">
                                <div className="relative flex aspect-video items-center justify-center bg-gray-50">
                                  <img
                                    src={template.image}
                                    alt={template.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="bg-white p-3">
                                  <h3 className="text-sm font-medium text-gray-900">
                                    {template.name}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          ))}
                          {templates.length > 0 && (
                            <button
                              onClick={() => handleCategorySelect(component.id)}
                              className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-all hover:border-blue-400 hover:bg-blue-50"
                            >
                              <div className="text-center">
                                <ChevronRight className="mx-auto h-6 w-6 text-gray-400" />
                                <p className="mt-2 text-sm font-medium text-gray-600">
                                  View All
                                </p>
                                <p className="text-xs text-gray-500">
                                  {component.templates?.length || 0} templates
                                </p>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {/* Selected Category Templates */}
                    {currentTemplates.map(({ component, templates }) => (
                      <div key={component.id}>
                        <div className="mb-6 flex items-center gap-3">
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                            Back to Popular
                          </button>
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                            <component.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {component.label}
                            </h2>
                            <p className="text-gray-600">
                              {component.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {templates.map(template => (
                            <div
                              key={template.id}
                              className="group cursor-pointer"
                              onClick={() =>
                                handleTemplateSelect(component.id, template.id)
                              }
                            >
                              <div className="relative overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-blue-400 hover:shadow-lg">
                                <div className="relative flex aspect-video items-center justify-center bg-gray-50">
                                  <img
                                    src={template.image}
                                    alt={template.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="bg-white p-3">
                                  <h3 className="text-sm font-medium text-gray-900">
                                    {template.name}
                                  </h3>
                                  {template.description && (
                                    <p className="mt-1 text-xs text-gray-500">
                                      {template.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
