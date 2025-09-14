import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PortfolioData } from "@/types/owner-site/components/portfolio";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { ExternalLink, Github, Eye, Plus, Trash2 } from "lucide-react";

interface PortfolioCard3Props {
  portfolioData: PortfolioData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioData>) => void;
}

export const PortfolioCard3: React.FC<PortfolioCard3Props> = ({
  portfolioData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(portfolioData);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const handleTextUpdate = (field: keyof PortfolioData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<PortfolioData>);
  };

  const handleCategoryUpdate = (index: number, newCategory: string) => {
    const updatedCategories = [...data.categories];
    const oldCategory = updatedCategories[index];
    updatedCategories[index] = newCategory;

    const updatedItems = data.items.map(item =>
      item.category === oldCategory ? { ...item, category: newCategory } : item
    );

    const updatedData = {
      ...data,
      categories: updatedCategories,
      items: updatedItems,
    };
    setData(updatedData);
    onUpdate?.({ categories: updatedCategories, items: updatedItems });
  };

  const handleAddCategory = () => {
    const newCategory = `New Category ${data.categories.length + 1}`;
    const updatedCategories = [...data.categories, newCategory];
    const updatedData = { ...data, categories: updatedCategories };
    setData(updatedData);
    onUpdate?.({ categories: updatedCategories });
  };

  const handleRemoveCategory = (index: number) => {
    if (data.categories.length <= 1) return;

    const categoryToRemove = data.categories[index];
    const updatedCategories = data.categories.filter((_, i) => i !== index);

    const firstRemainingCategory = updatedCategories[0];
    const updatedItems = data.items.map(item =>
      item.category === categoryToRemove
        ? { ...item, category: firstRemainingCategory }
        : item
    );

    const updatedData = {
      ...data,
      categories: updatedCategories,
      items: updatedItems,
    };
    setData(updatedData);
    onUpdate?.({ categories: updatedCategories, items: updatedItems });

    if (activeFilter === categoryToRemove) {
      setActiveFilter("All");
    }
  };

  const handleItemUpdate = (itemId: string, field: string, value: string) => {
    const updatedItems = data.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    const updatedData = { ...data, items: updatedItems };
    setData(updatedData);
    onUpdate?.({ items: updatedItems });
  };

  const handleItemImageUpdate = (
    itemId: string,
    imageUrl: string,
    altText?: string
  ) => {
    const updatedItems = data.items.map(item =>
      item.id === itemId
        ? { ...item, imageUrl, imageAlt: altText || item.imageAlt }
        : item
    );
    const updatedData = { ...data, items: updatedItems };
    setData(updatedData);
    onUpdate?.({ items: updatedItems });
  };

  const handleTechnologyUpdate = (
    itemId: string,
    techIndex: number,
    newTech: string
  ) => {
    const updatedItems = data.items.map(item => {
      if (item.id === itemId) {
        const updatedTechnologies = [...item.technologies];
        updatedTechnologies[techIndex] = newTech;
        return { ...item, technologies: updatedTechnologies };
      }
      return item;
    });
    const updatedData = { ...data, items: updatedItems };
    setData(updatedData);
    onUpdate?.({ items: updatedItems });
  };

  const handleAddTechnology = (itemId: string) => {
    const updatedItems = data.items.map(item => {
      if (item.id === itemId) {
        return { ...item, technologies: [...item.technologies, "New Tech"] };
      }
      return item;
    });
    const updatedData = { ...data, items: updatedItems };
    setData(updatedData);
    onUpdate?.({ items: updatedItems });
  };

  const handleRemoveTechnology = (itemId: string, techIndex: number) => {
    const updatedItems = data.items.map(item => {
      if (item.id === itemId) {
        const updatedTechnologies = item.technologies.filter(
          (_, i) => i !== techIndex
        );
        return { ...item, technologies: updatedTechnologies };
      }
      return item;
    });
    const updatedData = { ...data, items: updatedItems };
    setData(updatedData);
    onUpdate?.({ items: updatedItems });
  };

  const filteredItems =
    activeFilter === "All"
      ? data.items
      : data.items.filter(item => item.category === activeFilter);

  const categories = ["All", ...data.categories];

  const getBackgroundStyles = (): React.CSSProperties => {
    if (data.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${data.gradientFrom}, ${data.gradientTo})`,
      };
    }
    return { backgroundColor: data.backgroundColor };
  };

  return (
    <section className="px-4 py-16" style={getBackgroundStyles()}>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <EditableText
            value={data.subtitle}
            onChange={handleTextUpdate("subtitle")}
            as="span"
            className="text-primary text-sm font-semibold tracking-wide uppercase"
            isEditable={isEditable}
            placeholder="Enter subtitle..."
          />

          <EditableText
            value={data.title}
            onChange={handleTextUpdate("title")}
            as="h2"
            className="mt-2 mb-4 text-3xl font-bold text-gray-900 md:text-4xl"
            isEditable={isEditable}
            placeholder="Enter title..."
          />

          <EditableText
            value={data.description}
            onChange={handleTextUpdate("description")}
            as="p"
            className="mx-auto max-w-3xl text-lg text-gray-600"
            isEditable={isEditable}
            placeholder="Enter description..."
            multiline={true}
          />
        </div>

        {/* Filters */}
        {data.showFilters && (
          <div className="mb-12">
            <div className="mb-4 flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <div key={category} className="group relative">
                  {category === "All" ? (
                    <button
                      onClick={() => setActiveFilter(category)}
                      className={`transform rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 ${
                        activeFilter === category
                          ? "from-primary to-primary/80 scale-110 bg-gradient-to-r text-white shadow-2xl"
                          : "bg-white text-gray-700 shadow-lg hover:scale-105 hover:bg-gray-100"
                      }`}
                    >
                      All
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveFilter(category)}
                        className={`transform rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 ${
                          activeFilter === category
                            ? "from-primary to-primary/80 scale-110 bg-gradient-to-r text-white shadow-2xl"
                            : "bg-white text-gray-700 shadow-lg hover:scale-105 hover:bg-gray-100"
                        }`}
                      >
                        <EditableText
                          value={category}
                          onChange={value =>
                            handleCategoryUpdate(index - 1, value)
                          }
                          as="span"
                          isEditable={isEditable}
                          placeholder="Category name"
                        />
                      </button>
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveCategory(index - 1)}
                          className="p-1 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-700"
                          title="Remove category"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditable && (
              <div className="text-center">
                <button
                  onClick={handleAddCategory}
                  className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-gray-300 px-8 py-3 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
                >
                  <Plus className="h-3 w-3" />
                  Add Category
                </button>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Masonry Grid */}
        <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3 xl:columns-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Image */}
              <div className="group relative">
                <EditableImage
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  onImageChange={(url, alt) =>
                    handleItemImageUpdate(item.id, url, alt)
                  }
                  onAltChange={alt =>
                    handleItemUpdate(item.id, "imageAlt", alt)
                  }
                  isEditable={isEditable}
                  className="h-auto w-full object-cover"
                  width={400}
                  height={300}
                  cloudinaryOptions={{
                    folder: "portfolio-images",
                    resourceType: "image",
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Action Buttons */}
                <div className="absolute right-4 bottom-4 left-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.demoUrl && (
                    <EditableLink
                      text=""
                      href={item.demoUrl}
                      onChange={(_, href) =>
                        handleItemUpdate(item.id, "demoUrl", href)
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className="flex flex-1 items-center justify-center rounded-lg bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">View</span>
                    </EditableLink>
                  )}
                  {item.githubUrl && (
                    <EditableLink
                      text=""
                      href={item.githubUrl}
                      onChange={(_, href) =>
                        handleItemUpdate(item.id, "githubUrl", href)
                      }
                      isEditable={isEditable}
                      siteUser={siteUser}
                      className="flex flex-1 items-center justify-center rounded-lg bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                    >
                      <Github className="mr-1 h-4 w-4" />
                      <span className="text-xs font-medium">Code</span>
                    </EditableLink>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {data.showCategories && (
                  <Badge variant="secondary" className="mb-3">
                    <select
                      value={item.category}
                      onChange={e =>
                        handleItemUpdate(item.id, "category", e.target.value)
                      }
                      className="border-none bg-transparent text-xs text-inherit"
                      disabled={!isEditable}
                    >
                      {data.categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Badge>
                )}

                <EditableText
                  value={item.title}
                  onChange={value => handleItemUpdate(item.id, "title", value)}
                  as="h3"
                  className="mb-3 text-xl font-bold text-gray-900"
                  isEditable={isEditable}
                  placeholder="Project title"
                />

                {data.showTechnologies && (
                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.slice(0, 3).map((tech, techIndex) => (
                        <div key={techIndex} className="group relative">
                          <Badge variant="outline" className="pr-6 text-xs">
                            <EditableText
                              value={tech}
                              onChange={value =>
                                handleTechnologyUpdate(
                                  item.id,
                                  techIndex,
                                  value
                                )
                              }
                              as="span"
                              isEditable={isEditable}
                              placeholder="Technology"
                            />
                          </Badge>
                          {isEditable && (
                            <button
                              onClick={() =>
                                handleRemoveTechnology(item.id, techIndex)
                              }
                              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      {item.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.technologies.length - 3}
                        </Badge>
                      )}
                      {isEditable && (
                        <button
                          onClick={() => handleAddTechnology(item.id)}
                          className="inline-flex items-center gap-1 rounded border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-600 transition-colors hover:border-gray-400"
                        >
                          <Plus className="h-2 w-2" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {data.buttons.length > 0 && (
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              {data.buttons.map(button => (
                <EditableLink
                  key={button.id}
                  text={button.text}
                  href={button.href || "#"}
                  onChange={(text, href) => {
                    const updatedButtons = data.buttons.map(btn =>
                      btn.id === button.id ? { ...btn, text, href } : btn
                    );
                    const updatedData = { ...data, buttons: updatedButtons };
                    setData(updatedData);
                    onUpdate?.({ buttons: updatedButtons });
                  }}
                  isEditable={isEditable}
                  siteUser={siteUser}
                  className={`inline-block transform rounded-full px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 ${
                    button.variant === "primary"
                      ? "from-primary to-primary/80 bg-gradient-to-r text-white shadow-2xl"
                      : button.variant === "secondary"
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "hover:border-primary border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
