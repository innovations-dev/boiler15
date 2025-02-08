export interface TreeElement {
  id: string;
  name: string;
  children?: TreeElement[];
}

export interface TreeViewProps {
  elements: TreeElement[];
  className?: string;
  initialSelectedId?: string;
  initialExpendedItems?: string[];
  expandAll?: boolean;
  indicator?: boolean;
  onSelect?: (id: string) => void;
}

export interface BreadCrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "ghost" | "outline";
  dir?: "ltr" | "rtl";
  size?: "default" | "sm" | "lg";
}
