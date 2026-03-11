"use client";

import React from "react";
import { SkillsData } from "@/types/owner-site/components/skills";
import { useSkills } from "@/hooks/owner-site/admin/use-skill";
import { EditableText } from "@/components/ui/editable-text";
import { EditableLink } from "@/components/ui/editable-link";
import { ArrowUpRight } from "lucide-react";

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
  const { data: skills = [], isLoading } = useSkills();

  return (
    <section className="py-20 px-6 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            <EditableText
              value={data.title}
              onChange={title => onUpdate({ title })}
              isEditable={isEditable}
              as="span"
            />
          </h2>
          <div className="flex items-center gap-1 group cursor-pointer text-lg font-medium text-slate-800 hover:text-[#003d79] transition-colors">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-slate-100 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                <div className="mt-8 border-t border-slate-100"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {skills.length > 0 ? (
              skills.map(skill => (
                <div key={skill.id} className="flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {skill.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {skill.description}
                  </p>
                  <div className="mt-8 border-t border-slate-100"></div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400">
                No skills added yet. Manage your skills in the admin panel to
                display them here.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsStyle1;
