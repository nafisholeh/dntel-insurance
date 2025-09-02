import React from 'react';
import { ColumnKey } from './ClaimRow';
import { SortIcon, SearchIcon, FilterIcon, SortDirection } from './icons/TableIcons';

export interface TableColumn {
  key: ColumnKey;
  label: string;
  width: string;
  sortable?: boolean;
}

interface TableHeaderProps {
  columns: TableColumn[];
  gridTemplate: string;
  sortState: {
    column: ColumnKey | null;
    direction: SortDirection;
  };
  filterState: {
    patientName: string;
    status: string;
  };
  onSort: (column: ColumnKey) => void;
  onFilterIconClick: (type: 'patient' | 'status', event: React.MouseEvent) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  gridTemplate,
  sortState,
  filterState,
  onSort,
  onFilterIconClick,
}) => {
  return (
    <div 
      className="grid gap-5 px-6 bg-white border-b border-[#17533b0a] flex-shrink-0"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {columns.map((column) => (
        <div 
          key={`header-${column.key}`}
          className="text-left flex items-center py-5 font-medium text-sm text-[#546661]"
        >
          <span className="mr-1">{column.label}</span>
          <div className="flex items-center gap-1 ml-auto">
            {/* Sort Icon */}
            {column.sortable && (
              <button
                onClick={() => onSort(column.key)}
                className="cursor-pointer hover:opacity-75 select-none"
              >
                <SortIcon 
                  direction={sortState.column === column.key ? sortState.direction : null} 
                />
              </button>
            )}
            
            {/* Filter Icons */}
            {column.key === 'patient' && (
              <button
                onClick={(e) => onFilterIconClick('patient', e)}
                className="cursor-pointer hover:opacity-75"
              >
                <SearchIcon active={filterState.patientName !== ''} />
              </button>
            )}
            {column.key === 'status' && (
              <button
                onClick={(e) => onFilterIconClick('status', e)}
                className="cursor-pointer hover:opacity-75"
              >
                <FilterIcon active={filterState.status !== ''} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
