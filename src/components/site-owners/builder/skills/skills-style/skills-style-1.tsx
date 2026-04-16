"use client";

import React from "react";
import { SkillsData } from "@/types/owner-site/components/skills";
import { useSkills } from "@/hooks/owner-site/admin/use-skill";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ArrowUpRight, Hammer } from "lucide-react";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";

interface SkillsStyle1Props {
  data: SkillsData;
  onUpdate: (data: Partial<SkillsData>) => void;
  isEditable?: boolean;
}

const SkillsStyle1: React.FC<SkillsStyle1Props> = ({
  data,
  onUpdate,
  isEditable = true,
}) => {
  const { data: skills = [], isLoading , refetch } = useSkills();

  return (
    <section className="bg-white px-6 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            <EditableText
              value={data.title}
              onChange={title => onUpdate({ title })}
              isEditable={isEditable}
              as="span"
            />
          </h2>
          <div className="group flex cursor-pointer items-center gap-1 text-lg font-medium text-slate-800 transition-colors hover:text-[#003d79]">
            <EditableLink
              href={data.resume_link}
              text={data.resume_text}
              onChange={(text, href) =>
                onUpdate({ resume_link: href, resume_text: text })
              }
              isEditable={isEditable}
            />
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="mb-4 h-8 w-1/2 rounded bg-slate-100"></div>
                <div className="mb-2 h-4 w-full rounded bg-slate-100"></div>
                <div className="h-4 w-3/4 rounded bg-slate-100"></div>
                <div className="mt-8 border-t border-slate-100"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
            {skills.length > 0 ? (
              skills.map(skill => (
                <div key={skill.id} className="flex flex-col">
                  <h3 className="mb-4 text-2xl font-bold text-slate-900">
                    {skill.name}
                  </h3>
                  <p className="text-lg leading-relaxed text-slate-600">
                    {skill.description}
                  </p>
                  <div className="mt-8 border-t border-slate-100"></div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <BuilderEmptyState
                  icon={Hammer}
                  title="No Skills Added Yet"
                  description="Showcase your expertise to your visitors. Manage your skills in the admin panel to display them here."
                  actionLabel="Add New Skills"
                  actionLink="/admin/portfolio/skills"
                  isEditable={isEditable}
            isEmpty={skills.length === 0}
                onRefresh={refetch}
          />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsStyle1;
