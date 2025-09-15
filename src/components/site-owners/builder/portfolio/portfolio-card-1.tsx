import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortfolioData } from "@/types/owner-site/components/portfolio";
import { EditableText } from "@/components/ui/editable-text";
import { EditableImage } from "@/components/ui/editable-image";
import { EditableLink } from "@/components/ui/editable-link";
import { ExternalLink, Github, Eye, Plus, Trash2 } from "lucide-react";

interface PortfolioCard1Props {
  portfolioData: PortfolioData;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<PortfolioData>) => void;
}

export const PortfolioCard1: React.FC<PortfolioCard1Props> = ({
  portfolioData,
  siteUser,
  isEditable = false,
  onUpdate,
}) => {
  const [data, setData] = useState(portfolioData);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  const handleTextUpdate = (field: keyof PortfolioData) => (value: string) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate?.({ [field]: value } as Partial<PortfolioData>);
  };

  const handleCategoryUpdate = (index: number, newCategory: string) => {
    const updatedCategories = [...data.categories];
    const oldCategory = updatedCategories[index];
    updatedCategories[index] = newCategory;

    // Update items that had the old category
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
    if (data.categories.length <= 1) return; // Keep at least one category

    const categoryToRemove = data.categories[index];
    const updatedCategories = data.categories.filter((_, i) => i !== index);

    // Update items that had the removed category to use the first remaining category
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

    // Update active filter if it was the removed category
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

  const getBackgroundStyles = (): React.CSSProperties => {
    if (data.backgroundType === "gradient") {
      return {
        background: `linear-gradient(135deg, ${data.gradientFrom}, ${data.gradientTo})`,
      };
    }
    return { backgroundColor: data.backgroundColor };
  };

  const filteredItems =
    activeFilter === "All"
      ? data.items
      : data.items.filter(item => item.category === activeFilter);

  const displayedItems = showAll
    ? filteredItems
    : filteredItems.slice(0, data.itemsToShow);

  const categories = ["All", ...data.categories];

  return (
    <section className="px-4 py-16" style={getBackgroundStyles()}>
      <div className="container mx-auto max-w-6xl">
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
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {categories.map((category, index) => (
                <div key={category} className="group relative">
                  {category === "All" ? (
                    <button
                      onClick={() => setActiveFilter(category)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        activeFilter === category
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveFilter(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          activeFilter === category
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="inline-flex items-center gap-1 rounded-full border-2 border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
                >
                  <Plus className="h-3 w-3" />
                  Add Category
                </button>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Grid */}
        <div
          className={`mb-8 grid gap-6 ${
            data.columns === 2
              ? "md:grid-cols-2"
              : data.columns === 3
                ? "md:grid-cols-2 lg:grid-cols-3"
                : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {displayedItems.map(item => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
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
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={400}
                  height={300}
                  cloudinaryOptions={{
                    folder: "portfolio-images",
                    resourceType: "image",
                  }}
                />

                {/* Overlay */}
                <div className="bg-opacity-0 group-hover:bg-opacity-60 absolute inset-0 flex items-center justify-center bg-black transition-all duration-300">
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {item.demoUrl && (
                      <EditableLink
                        text=""
                        href={item.demoUrl}
                        onChange={(_, href) =>
                          handleItemUpdate(item.id, "demoUrl", href)
                        }
                        isEditable={isEditable}
                        siteUser={siteUser}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
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
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-gray-100"
                      >
                        <Github className="h-4 w-4 text-gray-700" />
                      </EditableLink>
                    )}
                    {item.projectUrl && (
                      <EditableLink
                        text=""
                        href={item.projectUrl}
                        onChange={(_, href) =>
                          handleItemUpdate(item.id, "projectUrl", href)
                        }
                        isEditable={isEditable}
                        siteUser={siteUser}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-gray-100"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-700" />
                      </EditableLink>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {data.showCategories && (
                  <Badge variant="outline" className="mb-2">
                    <select
                      value={item.category}
                      onChange={e =>
                        handleItemUpdate(item.id, "category", e.target.value)
                      }
                      className="border-none text-xs text-black"
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
                  className="mb-2 text-xl font-bold text-gray-900"
                  isEditable={isEditable}
                  placeholder="Project title"
                />

                {data.showDescription && (
                  <EditableText
                    value={item.description}
                    onChange={value =>
                      handleItemUpdate(item.id, "description", value)
                    }
                    as="p"
                    className="mb-3 text-gray-600"
                    isEditable={isEditable}
                    placeholder="Project description"
                    multiline={true}
                  />
                )}

                {data.showTechnologies && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.map((tech, techIndex) => (
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

        {/* Load More Button */}
        {data.showLoadMore &&
          filteredItems.length > data.itemsToShow &&
          !showAll && (
            <div className="text-center">
              <Button
                onClick={() => setShowAll(true)}
                variant="outline"
                className="px-8 py-3"
              >
                <EditableText
                  value="Load More Projects"
                  onChange={() => {}}
                  as="span"
                  isEditable={false}
                />
              </Button>
            </div>
          )}

        {/* Action Buttons */}
        {data.buttons.length > 0 && (
          <div className="mt-8 text-center">
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
                  className={`inline-block rounded-lg px-6 py-3 font-medium transition-colors ${
                    button.variant === "primary"
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : button.variant === "secondary"
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
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
