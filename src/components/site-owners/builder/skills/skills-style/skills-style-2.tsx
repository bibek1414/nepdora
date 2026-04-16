"use client";

import React from "react";
import { SkillsData } from "@/types/owner-site/components/skills";
import { useSkills } from "@/hooks/owner-site/admin/use-skill";
import { EditableText } from "@/components/ui/editable-text";
import { Hammer } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface SkillsStyle2Props {
  data: SkillsData;
  onUpdate: (data: Partial<SkillsData>) => void;
  isEditable?: boolean;
}

const SkillsStyle2: React.FC<SkillsStyle2Props> = ({
  data,
  onUpdate,
  isEditable = true,
}) => {
  const { data: skills = [], isLoading , refetch } = useSkills();

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Left Column: Title */}
          <div className="md:col-span-4 lg:col-span-3">
            <EditableText
              value={data.title}
              onChange={title => onUpdate({ title })}
              isEditable={isEditable}
              as="h2"
              className="text-5xl font-bold tracking-tight md:text-6xl"
            />
          </div>

          {/* Right Column: Skills List */}
          <div className="space-y-12 md:col-span-8 lg:col-span-9">
            {isLoading && (
              <div className="flex w-full flex-col gap-12">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-full animate-pulse border-b pb-12 last:border-0"
                  >
                    <div className="mb-6 h-10 w-1/3 rounded bg-slate-100"></div>
                    <div className="mb-3 h-5 w-full rounded bg-slate-100"></div>
                    <div className="h-5 w-4/5 rounded bg-slate-100"></div>
                  </div>
                ))}
              </div>
            )}
        {!isLoading && skills.length > 0 && (
              skills.map(skill => (
                <div
                  key={skill.id}
                  className="space-y-6 border-b border-gray-100 pb-12 last:border-0"
                >
                  <h3 className="text-2xl font-normal md:text-3xl">
                    {skill.name}
                  </h3>
                  <p className="prose prose-sm max-w-none leading-relaxed text-gray-500">
                    {skill.description}
                  </p>
                </div>
              ))
            )}
        {!isLoading && (
          <BuilderEmptyState
                icon={Hammer}
                title="No Skills Added Yet"
                description="Showcase your expertise to your visitors. Manage your skills in the admin panel to display them here."
                actionLabel="Add New Skills"
                actionLink="/admin/portfolio/skills"
                isEditable={isEditable}
               isEmpty={skills.length === 0} onRefresh={refetch}
          />
        )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsStyle2;
