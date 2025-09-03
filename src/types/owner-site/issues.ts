export interface IssueCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: number;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "open" | "in_progress" | "closed";
  reported_by?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  issue_category?: IssueCategory;
  created_at: string;
  updated_at: string;
}

// Request types
export interface CreateIssueCategoryRequest {
  name: string;
}

export interface UpdateIssueCategoryRequest {
  name?: string;
}

export interface CreateIssueRequest {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status?: "open" | "in_progress" | "closed" | "pending";
  issue_category?: number;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "open" | "in_progress" | "closed";
  issue_category?: number;
}

export interface DeleteIssueCategoryResponse {
  success: boolean;
  message: string;
}
export type CreateIssueCategoryResponse = IssueCategory;
export type UpdateIssueCategoryResponse = IssueCategory;
export type GetIssueCategoryResponse = IssueCategory;

export type CreateIssueResponse = Issue;
export type UpdateIssueResponse = Issue;
export type GetIssueResponse = Issue;

export interface DeleteIssueResponse {
  success: boolean;
  message: string;
}

// Priority and Status options
export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
] as const;
