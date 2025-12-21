"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTeamMembers } from "@/hooks/owner-site/admin/use-team-member";
import { TeamMemberDialog } from "./our-team-form";
import { TeamMembersTable } from "./team-members-table";
import { TEAM } from "@/types/owner-site/admin/team-member";
import { Plus, Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SimplePagination } from "@/components/ui/simple-pagination";

export const TeamManagement: React.FC = () => {
  const { data: members, isLoading, error } = useTeamMembers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TEAM | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const filteredMembers = (members || []).filter(
    member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedMembers = filteredMembers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-black/20" />
            <p className="text-xs text-black/40">Loading team members...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
          <div className="rounded-lg border border-black/5 bg-white p-12 text-center">
            <h2 className="text-sm font-medium text-red-600">
              Failed to load team members
            </h2>
            <p className="mt-1 text-xs text-black/40">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Team Management</h1>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={handleAddMember}
            className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>

        <TeamMembersTable
          members={paginatedMembers}
          onEdit={handleEditMember}
        />

        <SimplePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
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
