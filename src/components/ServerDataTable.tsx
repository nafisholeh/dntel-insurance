"use client";

import React, { useMemo } from "react";
import { ClaimRowData, ClaimStatus, ColumnKey } from "./ClaimRow";
import TableFooter from "./TableFooter";
import { TableHeader, TableColumn } from "./TableHeader";
import { DataRows } from "./DataRows";
import { PatientFilterPopup, StatusFilterPopup } from "./FilterPopups";
import { usePopup } from "../hooks/usePopup";

export interface ServerDataTableProps {
  columns: TableColumn[];
  data: ClaimRowData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    rowsPerPage: number;
    total: number;
  };
  sorting: {
    column: ColumnKey | null;
    direction: 'asc' | 'desc' | null;
  };
  filters: {
    patientName: string;
    status: ClaimStatus | '';
  };
  onSort: (column: ColumnKey) => void;
  onFilterChange: (filters: { patientName?: string; status?: ClaimStatus | '' }) => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  className?: string;
}

export function ServerDataTable({
  columns,
  data,
  pagination,
  sorting,
  filters,
  onSort,
  onFilterChange,
  onPageChange,
  onRowsPerPageChange,
  className = ""
}: ServerDataTableProps) {
  const popup = usePopup();

  // Available status options for filtering
  const statusOptions: ClaimStatus[] = [
    'PAID',
    'NCOF - RESUBMITTED',
    'PENDING',
    'DENIED',
    'PROCESSING'
  ];

  // Temporary filter states for popups
  const [tempPatientNameFilter, setTempPatientNameFilter] = React.useState<string>('');
  const [tempStatusFilter, setTempStatusFilter] = React.useState<ClaimStatus | ''>('');

  // Event handlers
  const handleFilterIconClick = (type: 'patient' | 'status', event: React.MouseEvent) => {
    // Initialize temp filters with current values
    if (type === 'patient') {
      setTempPatientNameFilter(filters.patientName);
    } else if (type === 'status') {
      setTempStatusFilter(filters.status);
    }
    popup.openPopup(type, event);
  };

  const handleSearchSubmit = () => {
    onFilterChange({ patientName: tempPatientNameFilter });
    popup.closePopup();
  };

  const handleSearchReset = () => {
    setTempPatientNameFilter('');
    onFilterChange({ patientName: '' });
    popup.closePopup();
  };

  const handleStatusApply = () => {
    onFilterChange({ status: tempStatusFilter });
    popup.closePopup();
  };

  const handleStatusReset = () => {
    setTempStatusFilter('');
    onFilterChange({ status: '' });
    popup.closePopup();
  };

  // Layout calculations
  const gridTemplate = columns.map(col => col.width).join(' ');
  
  const minWidth = useMemo(() => {
    const totalColumnWidth = columns.reduce((sum, col) => {
      const width = parseInt(col.width.replace('px', ''));
      return sum + width;
    }, 0);
    
    const gapSpace = (columns.length - 1) * 20; // 20px gap between columns
    return totalColumnWidth + gapSpace + 44; // extra padding from left and right
  }, [columns]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative" style={{ maxWidth: `${minWidth}px`, height: 'calc(100vh - 8rem)' }}>
      <div className={`h-full flex flex-col ${className}`}>
        {/* Header Row */}
        <TableHeader
          columns={columns}
          gridTemplate={gridTemplate}
          sortState={sorting}
          filterState={filters}
          onSort={onSort}
          onFilterIconClick={handleFilterIconClick}
        />

        {/* Filter Popups */}
        <PatientFilterPopup
          isOpen={popup.popupState.type === 'patient' && popup.popupState.isOpen}
          position={popup.popupState.position}
          tempPatientNameFilter={tempPatientNameFilter}
          onPatientNameChange={setTempPatientNameFilter}
          onApply={handleSearchSubmit}
          onReset={handleSearchReset}
        />

        <StatusFilterPopup
          isOpen={popup.popupState.type === 'status' && popup.popupState.isOpen}
          position={popup.popupState.position}
          tempStatusFilter={tempStatusFilter}
          statusOptions={statusOptions}
          onStatusChange={setTempStatusFilter}
          onApply={handleStatusApply}
          onReset={handleStatusReset}
        />

        {/* Overlay to close popup when clicking outside */}
        {popup.popupState.isOpen && (
          <div 
            className="fixed inset-0 z-40"
            onClick={popup.closePopup}
          />
        )}

        {/* Data rows */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <DataRows
            data={data}
            columns={columns}
            startIndex={(pagination.currentPage - 1) * pagination.rowsPerPage}
          />
        </div>

        {/* Footer */}
        <TableFooter
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </div>
    </div>
  );
}
