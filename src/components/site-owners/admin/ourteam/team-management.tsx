"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTeamMembers } from "@/hooks/owner-site/use-team-member";
import { TeamMemberDialog } from "./our-team-form";
import { TeamMembersTable } from "./team-members-table";
import { TEAM } from "@/types/owner-site/team-member";
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
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading team members...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="border-destructive p-8">
          <CardContent className="flex flex-col items-center space-y-4 text-center">
            <div className="bg-destructive/10 rounded-full p-3">
              <Users className="text-destructive h-8 w-8" />
            </div>
            <div>
              <h3 className="text-destructive mb-2 font-semibold">
                Failed to Load Team Members
              </h3>
              <p className="text-muted-foreground text-sm">
                {error.message ||
                  "An unexpected error occurred while loading the team members."}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Team Management</h1>
        </div>
        <Button
          onClick={handleAddMember}
          className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Team Members Table */}
      <TeamMembersTable members={members || []} onEdit={handleEditMember} />

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
