import { IconNode, LucideIcon } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  label: string;
  className?: string;
  sortable?: boolean;
  render: (row: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  placeholder?: string;
  type: "search" | "select" | "date";
  options?: FilterOption[];
}

export interface DataTableFilters {
  [key: string]: string | undefined;
  page?: string;
  sort?: string;
  sortDir?: "asc" | "desc";
}

export interface DataTableFetchResult<T> {
  data: T[];
  totalPages: number;
  total?: number;
}

export interface DataTableProps<T> {
  Icon: LucideIcon;
  title: string;
  description?: string;
  columns: ColumnDef<T>[];
  filters?: FilterConfig[];
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  fetchData: (
    filters: DataTableFilters,
    page: number,
    pageSize: number,
  ) => Promise<DataTableFetchResult<T>>;
  rowKey: (row: T) => string;
  emptyMessage?: string;
  headerActions?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

export const PRICE_OPTIONS = [
  { label: "Under ₱500", value: "0-500" },
  { label: "₱500 – ₱1,000", value: "500-1000" },
  { label: "₱1,000 – ₱5,000", value: "1000-5000" },
  { label: "₱5,000+", value: "5000-999999" },
];

export const RATING_OPTIONS = [
  { label: "4★ & up", value: "4" },
  { label: "3★ & up", value: "3" },
  { label: "2★ & up", value: "2" },
];

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Lowest price", value: "lowest" },
  { label: "Highest price", value: "highest" },
  { label: "Top rated", value: "rating" },
];
