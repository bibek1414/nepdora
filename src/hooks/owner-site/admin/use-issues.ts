import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { issuesApi } from "@/services/api/owner-sites/admin/issues";
import {
  CreateIssueCategoryRequest,
  UpdateIssueCategoryRequest,
  CreateIssueRequest,
  UpdateIssueRequest,
} from "@/types/owner-site/admin/issues";

interface ApiError {
  message?: string;
}

// Issue Categories Query Keys
const ISSUE_CATEGORIES_QUERY_KEY = ["issue-categories"] as const;
const ISSUE_CATEGORY_QUERY_KEY = (id: number) =>
  ["issue-category", id] as const;

// Issues Query Keys
const ISSUES_QUERY_KEY = ["issues"] as const;
const ISSUE_QUERY_KEY = (id: number) => ["issue", id] as const;

// Issue Categories Hooks
export function useIssueCategories() {
  return useQuery({
    queryKey: ISSUE_CATEGORIES_QUERY_KEY,
    queryFn: issuesApi.getIssueCategories,
  });
}

export function useIssueCategory(id: number) {
  return useQuery({
    queryKey: ISSUE_CATEGORY_QUERY_KEY(id),
    queryFn: () => issuesApi.getIssueCategory(id),
    enabled: !!id,
  });
}

export function useCreateIssueCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIssueCategoryRequest) =>
      issuesApi.createIssueCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_CATEGORIES_QUERY_KEY });
      toast.success("Issue category created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to create issue category");
    },
  });
}

export function useUpdateIssueCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateIssueCategoryRequest;
    }) => issuesApi.updateIssueCategory(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ISSUE_CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ISSUE_CATEGORY_QUERY_KEY(variables.id),
      });
      toast.success("Issue category updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update issue category");
    },
  });
}

export function useDeleteIssueCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => issuesApi.deleteIssueCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUE_CATEGORIES_QUERY_KEY });
      toast.success("Issue category deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete issue category");
    },
  });
}

// Issues Hooks
export function useIssues() {
  return useQuery({
    queryKey: ISSUES_QUERY_KEY,
    queryFn: issuesApi.getIssues,
  });
}

export function useIssue(id: number) {
  return useQuery({
    queryKey: ISSUE_QUERY_KEY(id),
    queryFn: () => issuesApi.getIssue(id),
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIssueRequest) => issuesApi.createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEY });
      toast.success("Issue created successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to create issue");
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIssueRequest }) =>
      issuesApi.updateIssue(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ISSUE_QUERY_KEY(variables.id),
      });
      toast.success("Issue updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update issue");
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => issuesApi.deleteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ISSUES_QUERY_KEY });
      toast.success("Issue deleted successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete issue");
    },
  });
}
