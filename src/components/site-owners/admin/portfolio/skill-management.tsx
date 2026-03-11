"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  useSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from "@/hooks/owner-site/admin/use-skill";
import SkillTable from "@/components/site-owners/admin/portfolio/skill-table";
import SkillDialog from "@/components/site-owners/admin/portfolio/skill-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skill } from "@/types/owner-site/admin/skill";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SkillManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    skill: Skill | null;
  }>({ isOpen: false, skill: null });

  const { data: skills = [], isLoading } = useSkills();

  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill();
  const deleteMutation = useDeleteSkill();

  const handleCreateNew = () => {
    setSelectedSkill(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDialogOpen(true);
  };

  const handleDelete = (skill: Skill) => {
    setDeleteDialog({ isOpen: true, skill });
  };

  const handleDialogSubmit = (data: { name: string; description: string }) => {
    if (selectedSkill) {
      updateMutation.mutate(
        { id: selectedSkill.id, skillData: data },
        {
          onSuccess: () => {
            toast.success("Skill updated successfully");
            setIsDialogOpen(false);
          },
          onError: () => {
            toast.error("Failed to update skill");
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Skill created successfully");
          setIsDialogOpen(false);
        },
        onError: () => {
          toast.error("Failed to create skill");
        },
      });
    }
  };

  const confirmDelete = () => {
    if (!deleteDialog.skill) return;

    deleteMutation.mutate(deleteDialog.skill.id, {
      onSuccess: () => {
        toast.success("Skill deleted successfully");
        setDeleteDialog({ isOpen: false, skill: null });
      },
      onError: () => {
        toast.error("Failed to delete skill");
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-6">
          <Link
            href="/admin/portfolio"
            className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolios
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#003d79]">Manage Skills</h1>
            <Button
              onClick={handleCreateNew}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        </div>

        <SkillTable
          skills={skills}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        <SkillDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleDialogSubmit}
          skill={selectedSkill}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <AlertDialog
          open={deleteDialog.isOpen}
          onOpenChange={open =>
            !open && setDeleteDialog({ isOpen: false, skill: null })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete skill &quot;
                {deleteDialog.skill?.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SkillManagement;
