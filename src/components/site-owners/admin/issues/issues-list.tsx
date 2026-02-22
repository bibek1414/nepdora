"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  useIssues,
  useIssueCategories,
  useCreateIssue,
  useUpdateIssue,
  useDeleteIssue,
} from "@/hooks/owner-site/admin/use-issues";
import { IssuesForm } from "./issues-form";
import { IssueHeader } from "./issues-header";
import { IssuesComponent } from "./issues-component";
import { DeleteDialog } from "./delete-dialog";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";
import { Issue, STATUS_OPTIONS } from "@/types/owner-site/admin/issues";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { IssueCard } from "./issues-card";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

type StatusKey = (typeof STATUS_OPTIONS)[number]["value"];

export default function IssuesList() {
  const { data: initialIssues = [], isLoading, error } = useIssues();
  const { data: categories = [] } = useIssueCategories();
  const createIssueMutation = useCreateIssue();
  const updateIssueMutation = useUpdateIssue();
  const deleteIssueMutation = useDeleteIssue();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteIssue, setDeleteIssue] = useState<Issue | null>(null);
  const [newIssueStatus, setNewIssueStatus] = useState<StatusKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialIssues) {
      setIssues(initialIssues);
    }
  }, [initialIssues]);

  // Group issues by status using the centralized STATUS_OPTIONS
  const issuesByStatus = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, { value: status }) => {
        acc[status] = issues.filter(issue => issue.status === status);
        return acc;
      },
      {} as Record<StatusKey, Issue[]>
    );
  }, [issues]);

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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const issueId = active.id as number;
    const issue = issues.find(i => i.id === issueId);
    if (issue) setActiveIssue(issue);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id;

    const activeIssue = issues.find(i => i.id === activeId);
    if (!activeIssue) return;

    // overId can be a number (issue ID) or a string (column status)
    const isOverIssue = typeof overId === "number";
    const isOverColumn = typeof overId === "string";

    if (isOverIssue) {
      const overIssue = issues.find(i => i.id === overId);
      if (overIssue && activeIssue.status !== overIssue.status) {
        setIssues(prev => {
          const updated = prev.map(i =>
            i.id === activeId ? { ...i, status: overIssue.status } : i
          );
          return updated;
        });
      }
    } else if (isOverColumn) {
      const newStatus = overId as StatusKey;
      if (activeIssue.status !== newStatus) {
        setIssues(prev => {
          const updated = prev.map(i =>
            i.id === activeId ? { ...i, status: newStatus } : i
          );
          return updated;
        });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) {
      setIssues(initialIssues);
      return;
    }

    const activeId = active.id as number;
    const overId = over.id;

    const activeIssue = issues.find(i => i.id === activeId);
    if (!activeIssue) return;

    let newStatus: StatusKey = activeIssue.status;

    if (typeof overId === "number") {
      const overIssue = issues.find(i => i.id === overId);
      if (overIssue) newStatus = overIssue.status;
    } else {
      newStatus = overId as StatusKey;
    }

    if (activeIssue.status !== newStatus || typeof overId === "number") {
      // If status changed or moved within column, persist
      try {
        await updateIssueMutation.mutateAsync({
          id: activeId,
          data: { status: newStatus },
        });
      } catch (error) {
        setIssues(initialIssues); // Rollback on error
      }
    }
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

        {isLoading && <LoadingState />}

        {!isLoading && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <IssuesComponent
              issuesByStatus={issuesByStatus}
              onAddIssue={handleAddIssue}
              onEditIssue={handleEditIssue}
              onDeleteIssue={handleDeleteIssue}
              onStatusChange={handleStatusChange}
            />
            {mounted &&
              createPortal(
                <DragOverlay>
                  {activeIssue ? (
                    <IssueCard
                      issue={activeIssue}
                      onEdit={() => {}}
                      onDelete={() => {}}
                      onStatusChange={() => {}}
                      isDragging
                    />
                  ) : null}
                </DragOverlay>,
                document.body
              )}
          </DndContext>
        )}

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
