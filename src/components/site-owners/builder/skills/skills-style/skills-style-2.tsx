"use client";

import React from "react";
import { SkillsData } from "@/types/owner-site/components/skills";
import { useSkills } from "@/hooks/owner-site/admin/use-skill";
import { EditableText } from "@/components/ui/editable-text";

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
  const { data: skills = [], isLoading } = useSkills();

  return (
    <section className="bg-white px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Title */}
          <div className="md:w-1/3">
            <EditableText
              value={data.title}
              onChange={title => onUpdate({ title })}
              isEditable={isEditable}
              as="h2"
            />
          </div>

          {/* Right Column: Skills List */}
          <div className="flex flex-col">
            {isLoading ? (
              <div className="flex w-full flex-col gap-16">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-full animate-pulse">
                    <div className="mb-6 h-10 w-1/3 rounded bg-slate-100"></div>
                    <div className="mb-3 h-5 w-full rounded bg-slate-100"></div>
                    <div className="mb-8 h-5 w-4/5 rounded bg-slate-100"></div>
                    <div className="border-t border-slate-200"></div>
                  </div>
                ))}
              </div>
            ) : skills.length > 0 ? (
              skills.map(skill => (
                <div key={skill.id} className="flex w-full flex-col">
                  <h3 className="mb-6 text-3xl text-slate-900">{skill.name}</h3>
                  <p className="max-w-2xl text-xl leading-relaxed text-slate-600">
                    {skill.description}
                  </p>
                  <div className="mt-12 w-full border-t border-slate-200"></div>
                </div>
              ))
            ) : (
              <div className="py-12 text-lg text-slate-400">
                No skills added yet. Manage your skills in the admin panel to
                display them here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsStyle2;
