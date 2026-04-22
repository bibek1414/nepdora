"use client";

import React from "react";
import { SkillsData } from "@/types/owner-site/components/skills";
import { useSkills } from "@/hooks/owner-site/admin/use-skill";
import { EditableText } from "@/components/ui/editable-text";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Skeleton } from "@/components/ui/skeleton";
import { BuilderEmptyState } from "@/components/ui/site-owners/builder-empty-state";
import { Hammer } from "lucide-react";

interface SkillsStyle3Props {
  data: SkillsData;
  onUpdate: (data: Partial<SkillsData>) => void;
  isEditable?: boolean;
}

const SkillsStyle3: React.FC<SkillsStyle3Props> = ({
  data,
  onUpdate,
  isEditable = true,
}) => {
  const { data: skills = [], isLoading, refetch } = useSkills();
  const { data: themeResponse } = useThemeQuery();

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      background: "#FFFFFF",
    },
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-8 lg:py-20">
        <section className="border-t border-gray-200 py-10 first:border-t-0 first:pt-0">
          <EditableText
            value={data.title}
            onChange={(title) => onUpdate({ title })}
            isEditable={isEditable}
            as="p"
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: theme.colors.primary }}
          />

          <div className="mt-6">
            {isLoading ? (
              <ul className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li key={i}>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </li>
                ))}
              </ul>
            ) : skills.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-900 transition-colors hover:border-gray-300"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
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
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default SkillsStyle3;
