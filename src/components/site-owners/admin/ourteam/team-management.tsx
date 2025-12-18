"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { TeamMemberDialog } from "./our-team-form";
import { TeamMembersTable } from "./team-members-table";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { Loader2, Plus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const TeamManagement: React.FC = () => {
  const { data: members, isLoading, error } = useTeamMembers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TEAM | null>(null);

  const handleAddMember = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEditMember = (member: TEAM) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setEditingMember(null);
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setEditingMember(null);
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            <p className="animate-pulse text-sm text-slate-400">
              Loading team members...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in min-h-screen bg-white duration-700">
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-red-50 p-3">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-600">
                Failed to Load Team Members
              </h3>
              <p className="text-sm text-slate-500">
                {error.message ||
                  "An unexpected error occurred while loading the team members."}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2 h-9 rounded-lg border-slate-200"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Team Management
            </h1>
            <p className="text-sm text-slate-500">
              Manage your team members and their roles.
            </p>
          </div>
          <Button
            onClick={handleAddMember}
            className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>

        {/* Team Members Table */}
        <TeamMembersTable members={members || []} onEdit={handleEditMember} />
      </div>

      {/* Team Member Dialog */}
      <TeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingMember={editingMember}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
};
