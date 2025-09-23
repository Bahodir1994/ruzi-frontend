// datatable-input.model.ts
export interface DataTableInput {
  draw: number;
  start: number;
  length: number;
  search: { value: string; regex: boolean };
  order: Array<{ column: number; dir: string }>;
  columns: Column[];
}

export interface Column {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  search: {
    value: string;
    regex: boolean
  }
}

export interface TableColumn {
  field: string;
  header: string;
  sortable: boolean;
  filterable: boolean;
  searchable: boolean;
  orderable: boolean;
}

// datatable-output.model.ts
export interface DataTableOutput<T> {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: T[];
}

export interface FiltersTable {

}
