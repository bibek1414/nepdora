"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IssueHeaderProps {
  onCreateIssue: () => void;
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
}

export function IssueHeader({
  onCreateIssue,
  totalIssues,
  openIssues,
  inProgressIssues,
}: IssueHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues </h1>
          <p className="text-gray-600">
            Track and manage issues across different statuses
          </p>
        </div>
        <Button
          onClick={onCreateIssue}
          className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Issue
        </Button>
      </div>
      {/* Stats */}
      {/* <div className="flex items-center space-x-6 text-sm text-gray-600">
        <span>Total: {totalIssues}</span>
        <span>Open: {openIssues}</span>
        <span>In Progress: {inProgressIssues}</span>
      </div> */}
    </div>
  );
}
