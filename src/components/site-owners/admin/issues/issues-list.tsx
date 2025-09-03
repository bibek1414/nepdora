"use client";

import React, { useState } from "react";
import {
  useIssues,
  useIssueCategories,
  useCreateIssue,
  useUpdateIssue,
  useDeleteIssue,
} from "@/hooks/owner-site/use-issues";
import { IssuesForm } from "./issues-form";
import { IssueHeader } from "./issues-header";
import { IssuesComponent } from "./issues-component";
import { DeleteDialog } from "./delete-dialog";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";
import { Issue, STATUS_OPTIONS } from "@/types/owner-site/issues";

type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];

export default function IssuesList() {
  const { data: issues = [], isLoading, error } = useIssues();
  const { data: categories = [] } = useIssueCategories();
  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteIssue, setDeleteIssue] = useState<Issue | null>(null);
  const [newIssueStatus, setNewIssueStatus] = useState<StatusKey | null>(null);

  // Group issues by status using the centralized STATUS_OPTIONS
  const issuesByStatus: Record<StatusKey, Issue[]> = STATUS_OPTIONS.reduce(
    (acc, { value: status }) => {
      acc[status] = issues.filter(issue => issue.status === status);
      return acc;
    },
    {} as Record<StatusKey, Issue[]>
  );

  const handleAddIssue = (status?: StatusKey) => {
    setSelectedIssue(null);
    setNewIssueStatus(status || "pending");
    setIsFormOpen(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setNewIssueStatus(null);
    setIsFormOpen(true);
  };

  const handleDeleteIssue = (issue: Issue) => {
    setDeleteIssue(issue);
  };

  const handleConfirmDelete = async (issueId: number) => {
    try {
      await deleteIssueMutation.mutateAsync(issueId);
      setDeleteIssue(null);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleStatusChange = async (issueId: number, newStatus: StatusKey) => {
    try {
      await updateIssueMutation.mutateAsync({
        id: issueId,
        data: { status: newStatus },
      });
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleDrop = (issueId: number, newStatus: StatusKey) => {
    handleStatusChange(issueId, newStatus);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedIssue(null);
    setNewIssueStatus(null);
  };

  // Calculate stats
  const totalIssues = issues.length;
  const openIssues = issues.filter(issue => issue.status === "open").length;
  const inProgressIssues = issues.filter(
    issue => issue.status === "in_progress"
  ).length;

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="bg-white px-4 py-5">
      <div className="mx-auto max-w-[76rem]">
        <IssueHeader
          onCreateIssue={() => handleAddIssue()}
          totalIssues={totalIssues}
          openIssues={openIssues}
          inProgressIssues={inProgressIssues}
        />

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Kanban Board */}
        {!isLoading && (
          <IssuesComponent
            issuesByStatus={issuesByStatus}
            onAddIssue={handleAddIssue}
            onEditIssue={handleEditIssue}
            onDeleteIssue={handleDeleteIssue}
            onStatusChange={handleStatusChange}
            onDrop={handleDrop}
          />
        )}

        {/* Forms and Dialogs */}
        <IssuesForm
          issue={selectedIssue}
          open={isFormOpen}
          onOpenChange={handleFormClose}
          initialStatus={newIssueStatus}
        />

        <DeleteDialog
          isOpen={!!deleteIssue}
          onClose={() => setDeleteIssue(null)}
          issue={deleteIssue}
          onConfirm={handleConfirmDelete}
          isLoading={deleteIssueMutation.isPending}
        />
      </div>
    </div>
  );
}
