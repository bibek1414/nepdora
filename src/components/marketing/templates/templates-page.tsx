import { useTemplateApi } from "@/services/api/super-admin/components/template";
import { useTemplateCategoryApi } from "@/services/api/super-admin/components/template-category";
import TemplatesInteractive from "./templates-interactive";

interface TemplatesPageProps {
  asH1?: boolean;
}

const TemplatesPage = async ({ asH1 = false }: TemplatesPageProps) => {
  const [categoriesData, initialTemplates] = await Promise.all([
    useTemplateCategoryApi.getCategories().catch(() => []),
    useTemplateApi
      .getTemplates(1, 12)
      .catch(() => ({ count: 0, next: null, previous: null, results: [] })),
  ]);

  const categories = [
    { key: "All", label: "All" },
    ...categoriesData.map(cat => ({ key: cat.slug, label: cat.name })),
  ];

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6">
        <div className="mb-8 flex flex-col items-center gap-4 text-center sm:mb-10 sm:gap-5 md:mb-12">
          <div className="w-full">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Website Templates for Every Nepali Business
            </h2>
            <p className="mx-auto text-sm sm:text-base">
              Ready-made website templates for Nepal - pick your industry and go
              live today.
            </p>
          </div>
        </div>

        <TemplatesInteractive
          initialCategories={categories}
          initialTemplates={initialTemplates}
        />
      </div>
    </section>
  );
};

export default TemplatesPage;
