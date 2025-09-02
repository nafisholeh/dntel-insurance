"use client";

import React, { useState, useMemo } from "react";
import ClaimRow, { ClaimRowData, ColumnKey } from "./ClaimRow";
import TableFooter from "./TableFooter";

export interface TableColumn {
  key: ColumnKey;
  label: string;
  width: string;
}

export interface DataTableProps {
  columns: TableColumn[];
  data: ClaimRowData[];
  className?: string;
  defaultRowsPerPage?: number;
}

/**
 * Robust DataTable component using CSS Grid
 * - Automatically calculates minimum width
 * - Maintains consistent styling
 * - Provides type safety
 * - Makes columns easily configurable
 * - Uses dedicated ClaimRow component for data rendering
 * - Includes pagination with customizable rows per page
 */
export default function DataTable({ 
  columns, 
  data, 
  className = "", 
  defaultRowsPerPage = 20 
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Calculate pagination values
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  // Get current page data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, rowsPerPage]);

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
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden" style={{ maxWidth: `${minWidth}px` }}>
      <div className={`overflow-x-auto ${className}`}>
        <div>
          {/* Header Row */}
          <div 
            className="grid gap-5 px-6"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((column) => (
              <div 
                key={`header-${column.key}`}
                className="text-left flex items-center py-5 font-medium text-sm text-[#546661]"
              >
                {column.label}
              </div>
            ))}
          </div>

          {/* Data Rows using ClaimRow component */}
          {paginatedData.map((row, rowIndex) => (
            <ClaimRow 
              key={rowIndex}
              data={row}
              columns={columns}
            />
          ))}
        </div>
        
        {/* Table Footer with Pagination */}
        <TableFooter
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}
