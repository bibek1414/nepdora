import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableWrapper, TableActionButtons } from "@/components/ui/custom-table";
import { Skill } from "@/types/owner-site/admin/skill";
import { FolderOpen, RefreshCw } from "lucide-react";

interface SkillTableProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
  isLoading: boolean;
}

const SkillTable: React.FC<SkillTableProps> = ({
  skills,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <TableWrapper>
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
          <p className="animate-pulse text-sm text-slate-400">
            Loading skills...
          </p>
        </div>
      </TableWrapper>
    );
  }

  if (skills.length === 0) {
    return (
      <TableWrapper>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FolderOpen className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">
            No skills found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by adding your first skill.
          </p>
        </div>
      </TableWrapper>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Skill Name
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Description
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map(skill => (
            <TableRow
              key={skill.id}
              className="group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
              onClick={() => onEdit(skill)}
            >
              <TableCell className="px-6 py-4">
                <span className="text-sm font-normal text-black">
                  {skill.name}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="line-clamp-1 text-xs text-black/50">
                  {skill.description}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons
                  onEdit={() => onEdit(skill)}
                  onDelete={() => onDelete(skill)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SkillTable;
