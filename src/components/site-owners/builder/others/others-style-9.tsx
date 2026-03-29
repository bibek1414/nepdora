"use client";

import React from "react";
import { motion } from "framer-motion";
import { OthersTemplate9Data } from "@/types/owner-site/components/others";
import { EditableText } from "@/components/ui/editable-text";
import { useBuilderLogic } from "@/hooks/use-builder-logic";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface OthersTemplate9Props {
  othersData: OthersTemplate9Data;
  isEditable?: boolean;
  siteUser?: string;
  onUpdate?: (updatedData: Partial<OthersTemplate9Data>) => void;
}

export const OthersTemplate9: React.FC<OthersTemplate9Props> = ({
  othersData,
  isEditable = false,
  onUpdate,
}) => {
  const { data, handleArrayItemUpdate, handleTextUpdate } = useBuilderLogic(
    othersData,
    onUpdate
  );

  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const colors = theme?.colors || {
    primary: "#000000",
    primaryForeground: "#ffffff",
    secondary: "#f3f4f6",
  };

  const handleRoutineUpdate = (
    routineIndex: number,
    field: string,
    value: string
  ) => {
    const newRoutines = [...(data.routines || [])];
    newRoutines[routineIndex] = {
      ...newRoutines[routineIndex],
      [field]: value,
    };
    onUpdate?.({ routines: newRoutines });
  };

  const handleStepUpdate = (
    routineIndex: number,
    stepIndex: number,
    field: string,
    value: string
  ) => {
    const newRoutines = [...(data.routines || [])];
    const newSteps = [...(newRoutines[routineIndex].steps || [])];
    newSteps[stepIndex] = { ...newSteps[stepIndex], [field]: value };
    newRoutines[routineIndex] = {
      ...newRoutines[routineIndex],
      steps: newSteps,
    };
    onUpdate?.({ routines: newRoutines });
  };

  return (
    <section id="routine" className="w-full bg-white/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <EditableText
              value={data.label || "The basics"}
              onChange={handleTextUpdate("label")}
              isEditable={isEditable}
              as="span"
              className="inline-block rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold tracking-wide text-slate-800 uppercase"
            />
            <EditableText
              value={data.title || "Your daily routine, simplified"}
              onChange={handleTextUpdate("title")}
              isEditable={isEditable}
              as="h2"
              multiline
              className="mt-6 text-3xl font-bold tracking-tight text-slate-900"
            />
            <EditableText
              value={
                data.subtitle ||
                "Every great skin day starts with the right order."
              }
              onChange={handleTextUpdate("subtitle")}
              isEditable={isEditable}
              as="p"
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl"
              multiline
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {data.routines?.map((routine, rIdx) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, x: rIdx === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white"
            >
              <div className="border-b border-slate-100 p-8 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                        rIdx === 0
                          ? "bg-amber-50 text-amber-500"
                          : "bg-indigo-50 text-indigo-500"
                      }`}
                    >
                      <EditableText
                        value={routine.icon || (rIdx === 0 ? "☀️" : "🌙")}
                        onChange={val => handleRoutineUpdate(rIdx, "icon", val)}
                        isEditable={isEditable}
                        as="span"
                      />
                    </div>
                    <div>
                      <EditableText
                        value={routine.title || "Routine Title"}
                        onChange={val =>
                          handleRoutineUpdate(rIdx, "title", val)
                        }
                        isEditable={isEditable}
                        as="h3"
                      />
                      <EditableText
                        value={routine.description || "Description"}
                        onChange={val =>
                          handleRoutineUpdate(rIdx, "description", val)
                        }
                        isEditable={isEditable}
                        as="span"
                      />
                    </div>
                  </div>
                  <span>
                    <EditableText
                      value={routine.stepCount || "0 steps"}
                      onChange={val =>
                        handleRoutineUpdate(rIdx, "stepCount", val)
                      }
                      isEditable={isEditable}
                      as="span"
                      className="hidden rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-600 sm:block"
                    />
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2 bg-slate-50/30 p-6 md:p-8">
                {routine.steps?.map((step, sIdx) => (
                  <div
                    key={step.id}
                    className="group relative flex items-center gap-6 rounded-2xl border border-transparent bg-white p-5 transition-all hover:border-slate-200"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 transition-colors">
                      {sIdx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-slate-900">
                        <EditableText
                          value={step.name || "Step Name"}
                          onChange={val =>
                            handleStepUpdate(rIdx, sIdx, "name", val)
                          }
                          isEditable={isEditable}
                          as="div"
                        />
                      </div>
                      <div className="line-clamp-2 text-sm text-slate-500 md:line-clamp-none">
                        <EditableText
                          value={
                            step.description || "Step description goes here..."
                          }
                          onChange={val =>
                            handleStepUpdate(rIdx, sIdx, "description", val)
                          }
                          isEditable={isEditable}
                          multiline
                        />
                      </div>
                    </div>
                    <div className="scale-100 text-3xl grayscale transition-all group-hover:scale-110 group-hover:grayscale-0">
                      <EditableText
                        value={step.icon || "🧴"}
                        onChange={val =>
                          handleStepUpdate(rIdx, sIdx, "icon", val)
                        }
                        isEditable={isEditable}
                        as="div"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
