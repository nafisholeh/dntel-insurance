"use client";

import React, { useState, useMemo } from "react";
import ClaimRow, { ClaimRowData, ColumnKey } from "./ClaimRow";
import TableFooter from "./TableFooter";

export interface TableColumn {
  key: ColumnKey;
  label: string;
  width: string;
  sortable?: boolean;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: ClaimRowData[];
  className?: string;
  defaultRowsPerPage?: number;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  column: ColumnKey | null;
  direction: SortDirection;
}

const SortIcon = ({ direction }: { direction: SortDirection }) => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Up arrow (ascending) */}
      <path 
        d="M8 3L12 7H4L8 3Z" 
        fill="#1A6444" 
        opacity={direction === 'asc' ? 1 : 0.5}
      />
      {/* Down arrow (descending) */}
      <path 
        d="M8 13L4 9H12L8 13Z" 
        fill="#1A6444" 
        opacity={direction === 'desc' ? 1 : 0.5}
      />
    </svg>
  );
};

/**
 * Robust DataTable component using CSS Grid
 * - Automatically calculates minimum width
 * - Maintains consistent styling
 * - Provides type safety
 * - Makes columns easily configurable
 * - Uses dedicated ClaimRow component for data rendering
 * - Includes pagination with customizable rows per page
 * - Supports sorting by clickable column headers
 */
export default function DataTable({ 
  columns, 
  data, 
  className = "", 
  defaultRowsPerPage = 20 
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null
  });

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      // Handle nested object properties
      if (sortState.column === 'patient') {
        aValue = a.patient.name;
        bValue = b.patient.name;
      } else if (sortState.column === 'lastUpdated') {
        aValue = new Date(a.lastUpdated.date);
        bValue = new Date(b.lastUpdated.date);
      } else {
        aValue = a[sortState.column as keyof ClaimRowData] as string;
        bValue = b[sortState.column as keyof ClaimRowData] as string;
      }

      // Handle date sorting
      if (sortState.column === 'serviceDate' || sortState.column === 'lastUpdated') {
        const dateA = sortState.column === 'lastUpdated' ? aValue as Date : new Date(aValue as string);
        const dateB = sortState.column === 'lastUpdated' ? bValue as Date : new Date(bValue as string);
        return sortState.direction === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // String sorting (for patient name, status, etc.)
      const stringA = String(aValue).toLowerCase();
      const stringB = String(bValue).toLowerCase();
      
      if (sortState.direction === 'asc') {
        return stringA < stringB ? -1 : stringA > stringB ? 1 : 0;
      } else {
        return stringA > stringB ? -1 : stringA < stringB ? 1 : 0;
      }
    });

    return sorted;
  }, [data, sortState]);

  // Handle column header click
  const handleSort = (columnKey: ColumnKey) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    setSortState(prev => {
      if (prev.column === columnKey) {
        // Cycle through: asc -> desc -> null
        if (prev.direction === 'asc') {
          return { column: columnKey, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          return { column: null, direction: null };
        }
      }
      return { column: columnKey, direction: 'asc' };
    });

    // Reset to first page when sorting
    setCurrentPage(1);
  };

  // Calculate pagination values
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  // Get current page data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage]);

  // Reset to first page when rows per page changes
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Generate grid template from column widths
  const gridTemplate = columns.map(col => col.width).join(' ');
  
  // Calculate total minimum width (column widths + gaps + padding)
  const totalColumnWidth = columns.reduce((sum, col) => {
    const width = parseInt(col.width.replace('px', ''));
    return sum + width;
  }, 0);
  
  // Add space for gaps (20px * (columns - 1)) and some padding
  const gapSpace = (columns.length - 1) * 20; // 20px gap between columns
  const minWidth = totalColumnWidth + gapSpace + 44; // extra padding from left and right 

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden" style={{ maxWidth: `${minWidth}px`, maxHeight: 'calc(100vh - 2rem)' }}>
      <div className={`h-full flex flex-col ${className}`}>
        {/* Header Row */}
        <div 
          className="grid gap-5 px-6 bg-white flex-shrink-0"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          {columns.map((column) => (
            <div 
              key={`header-${column.key}`}
              className={`text-left flex items-center py-5 font-medium text-sm text-[#546661] ${
                column.sortable ? 'cursor-pointer hover:text-[#1A6444] select-none' : ''
              }`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <span className="mr-1">{column.label}</span>
              {column.sortable && (
                <SortIcon 
                  direction={sortState.column === column.key ? sortState.direction : null} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        <div className="flex-1 overflow-auto">
          {paginatedData.map((row, rowIndex) => (
            <ClaimRow 
              key={rowIndex}
              data={row}
              columns={columns}
            />
          ))}
        </div>
        
        {/* Table Footer */}
        <div className="flex-shrink-0">
          <TableFooter
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={setCurrentPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}
