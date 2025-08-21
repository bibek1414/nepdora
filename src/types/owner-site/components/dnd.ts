export interface DragItem {
  type: string;
  id: string;
  component?: string;
}

export interface DroppableArea {
  id: string;
  type: string;
  accepts: string[];
}

// Component Types
export interface ComponentLibraryItem {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType;
  category: "basics" | "advanced";
}
