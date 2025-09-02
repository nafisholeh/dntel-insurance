"use client";

import React, { useMemo } from "react";
import { ClaimRowData, ClaimStatus } from "./ClaimRow";
import TableFooter from "./TableFooter";
import { TableHeader, TableColumn } from "./TableHeader";
import { DataRows } from "./DataRows";
import { PatientFilterPopup, StatusFilterPopup } from "./FilterPopups";
import { usePagination } from "../hooks/usePagination";
import { useDataFilter } from "../hooks/useDataFilter";
import { useDataSort } from "../hooks/useDataSort";
import { usePopup } from "../hooks/usePopup";

export interface DataTableProps {
  columns: TableColumn[];
  data: ClaimRowData[];
  className?: string;
  defaultRowsPerPage?: number;
}

export default function DataTable({ 
  columns, 
  data, 
  className = "", 
  defaultRowsPerPage = 10 
}: DataTableProps) {
  // Custom hooks for state management
  const pagination = usePagination<ClaimRowData>({ defaultRowsPerPage });
  const dataFilter = useDataFilter(data);
  const dataSort = useDataSort();
  const popup = usePopup();

  // Available status options for filtering
  const statusOptions: ClaimStatus[] = [
    'PAID',
    'NCOF - RESUBMITTED',
    'PENDING',
    'DENIED',
    'PROCESSING'
  ];

  // Process data through filter and sort pipeline
  const sortedData = useMemo(() => {
    return dataSort.getSortedData(dataFilter.filteredData);
  }, [dataFilter.filteredData, dataSort]);

  const currentPageData = useMemo(() => {
    return pagination.getPaginatedData(sortedData);
  }, [sortedData, pagination]);

  const totalPages = Math.ceil(sortedData.length / pagination.rowsPerPage);

  // Event handlers
  const handleFilterIconClick = (type: 'patient' | 'status', event: React.MouseEvent) => {
    dataFilter.initializeTempFilters(type);
    popup.openPopup(type, event);
  };

  const handleSearchSubmit = () => {
    dataFilter.handleFilterChange({ patientName: dataFilter.tempPatientNameFilter });
    popup.closePopup();
    pagination.setCurrentPage(1);
  };

  const handleSearchReset = () => {
    dataFilter.setTempPatientNameFilter('');
    dataFilter.handleFilterChange({ patientName: '' });
    popup.closePopup();
  };

  const handleStatusApply = () => {
    dataFilter.handleFilterChange({ status: dataFilter.tempStatusFilter });
    popup.closePopup();
  };

  const handleStatusReset = () => {
    dataFilter.setTempStatusFilter('');
    dataFilter.handleFilterChange({ status: '' });
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
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative" style={{ maxWidth: `${minWidth}px`, maxHeight: 'calc(100vh - 2rem)' }}>
      <div className={`h-full flex flex-col ${className}`}>
        {/* Header Row */}
        <TableHeader
          columns={columns}
          gridTemplate={gridTemplate}
          sortState={dataSort.sortState}
          filterState={dataFilter.filterState}
          onSort={dataSort.handleSort}
          onFilterIconClick={handleFilterIconClick}
        />

        {/* Filter Popups */}
        <PatientFilterPopup
          isOpen={popup.popupState.type === 'patient' && popup.popupState.isOpen}
          position={popup.popupState.position}
          tempPatientNameFilter={dataFilter.tempPatientNameFilter}
          onPatientNameChange={dataFilter.setTempPatientNameFilter}
          onApply={handleSearchSubmit}
          onReset={handleSearchReset}
        />

        <StatusFilterPopup
          isOpen={popup.popupState.type === 'status' && popup.popupState.isOpen}
          position={popup.popupState.position}
          tempStatusFilter={dataFilter.tempStatusFilter}
          statusOptions={statusOptions}
          onStatusChange={dataFilter.setTempStatusFilter}
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
            data={currentPageData}
            columns={columns}
            startIndex={pagination.startIndex}
          />
        </div>

        {/* Footer */}
        <TableFooter
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          rowsPerPage={pagination.rowsPerPage}
          onPageChange={pagination.setCurrentPage}
          onRowsPerPageChange={pagination.setRowsPerPage}
        />
      </div>
    </div>
  );
}