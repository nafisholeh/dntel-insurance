"use client";

import React, { useState, useMemo } from "react";
import ClaimRow, { ClaimRowData, ColumnKey, ClaimStatus } from "./ClaimRow";
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

interface FilterState {
  patientName: string;
  status: ClaimStatus | '';
}

interface PopupState {
  isOpen: boolean;
  type: 'patient' | 'status' | null;
  position: {
    top: number;
    left: number;
  };
}

// Sort Icon Component
const SortIcon = ({ direction }: { direction: SortDirection }) => (
  <div className="flex flex-col items-center ml-1">
    <svg 
      width="8" 
      height="4" 
      viewBox="0 0 8 4" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`mb-1 ${direction === 'asc' ? 'opacity-100' : 'opacity-50'}`}
    >
      <path d="M4 0L8 4H0L4 0Z" fill="currentColor"/>
    </svg>
    <svg 
      width="8" 
      height="4" 
      viewBox="0 0 8 4" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={direction === 'desc' ? 'opacity-100' : 'opacity-50'}
    >
      <path d="M4 4L0 0H8L4 4Z" fill="currentColor"/>
    </svg>
  </div>
);

// Search Icon Component
const SearchIcon = ({ active }: { active: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={active ? 'opacity-100' : 'opacity-50'}
  >
    <path 
      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 14L11.1 11.1" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Filter Icon Component
const FilterIcon = ({ active }: { active: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={active ? 'opacity-100' : 'opacity-50'}
  >
    <path 
      d="M2.66666 2.66666H13.3333L8.66666 8.66666V12.6667L7.33333 13.3333V8.66666L2.66666 2.66666Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default function DataTable({ 
  columns, 
  data, 
  className = "", 
  defaultRowsPerPage = 10 
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [filterState, setFilterState] = useState<FilterState>({ patientName: '', status: '' });
  const [tempStatusFilter, setTempStatusFilter] = useState<ClaimStatus | ''>('');
  const [tempPatientNameFilter, setTempPatientNameFilter] = useState<string>('');
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: null,
    position: { top: 0, left: 0 }
  });

  // Available status options for filtering
  const statusOptions: ClaimStatus[] = [
    'PAID',
    'NCOF - RESUBMITTED',
    'PENDING',
    'DENIED',
    'PROCESSING'
  ];

  // Sorting logic
  const handleSort = (column: ColumnKey) => {
    setSortState((prev) => {
      if (prev.column === column) {
        // Cycle through: asc -> desc -> null
        const nextDirection = prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc';
        return { column: nextDirection ? column : null, direction: nextDirection };
      } else {
        return { column, direction: 'asc' };
      }
    });
  };

  // Filter logic
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Popup handlers
  const handleFilterIconClick = (type: 'patient' | 'status', event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Initialize temp values with current filter values
    if (type === 'status') {
      setTempStatusFilter(filterState.status);
    } else if (type === 'patient') {
      setTempPatientNameFilter(filterState.patientName);
    }
    
    setPopupState({
      isOpen: true,
      type,
      position: {
        top: rect.bottom + 8,
        left: rect.left - 150, // Offset to center the popup
      }
    });
  };

  const handleSearchSubmit = () => {
    handleFilterChange({ patientName: tempPatientNameFilter });
    setPopupState({ isOpen: false, type: null, position: { top: 0, left: 0 } });
    setCurrentPage(1);
  };

  const handleSearchReset = () => {
    setTempPatientNameFilter('');
    handleFilterChange({ patientName: '' });
    setPopupState({ isOpen: false, type: null, position: { top: 0, left: 0 } });
  };

  const handleStatusFilter = (status: ClaimStatus | '') => {
    setTempStatusFilter(status);
  };

  const handleStatusApply = () => {
    handleFilterChange({ status: tempStatusFilter });
    setPopupState({ isOpen: false, type: null, position: { top: 0, left: 0 } });
  };

  const handleStatusReset = () => {
    setTempStatusFilter('');
    handleFilterChange({ status: '' });
    setPopupState({ isOpen: false, type: null, position: { top: 0, left: 0 } });
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesPatient = filterState.patientName === '' || 
        row.patient.name.toLowerCase().includes(filterState.patientName.toLowerCase());
      const matchesStatus = filterState.status === '' || row.status === filterState.status;
      
      return matchesPatient && matchesStatus;
    });
  }, [data, filterState]);

  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      // Handle different data types based on column
      if (sortState.column === 'patient') {
        aValue = a.patient.name.toLowerCase();
        bValue = b.patient.name.toLowerCase();
      } else if (sortState.column === 'serviceDate') {
        aValue = new Date(a.serviceDate).getTime();
        bValue = new Date(b.serviceDate).getTime();
      } else if (sortState.column === 'lastUpdated') {
        aValue = new Date(a.lastUpdated.date).getTime();
        bValue = new Date(b.lastUpdated.date).getTime();
      } else if (sortState.column === 'status') {
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
      }
      
      if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortState]);

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = sortedData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Generate grid template for CSS Grid
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
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative" style={{ maxWidth: `${minWidth}px`, maxHeight: 'calc(100vh - 2rem)' }}>
      <div className={`h-full flex flex-col ${className}`}>
        {/* Header Row */}
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
                    onClick={() => handleSort(column.key)}
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
                    onClick={(e) => handleFilterIconClick('patient', e)}
                    className="cursor-pointer hover:opacity-75"
                  >
                    <SearchIcon active={filterState.patientName !== ''} />
                  </button>
                )}
                {column.key === 'status' && (
                  <button
                    onClick={(e) => handleFilterIconClick('status', e)}
                    className="cursor-pointer hover:opacity-75"
                  >
                    <FilterIcon active={filterState.status !== ''} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Popups */}
        {popupState.type === 'patient' && popupState.isOpen && (
          <div 
            className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[300px]"
            style={{
              top: popupState.position.top,
              left: popupState.position.left,
            }}
          >
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#546661] mb-2">
                Search Patient Name
              </label>
              <input
                type="text"
                value={tempPatientNameFilter}
                onChange={(e) => setTempPatientNameFilter(e.target.value)}
                placeholder="Enter patient name..."
                className="w-full px-3 py-2 border border-[#17533b14] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A6444] focus:border-[#1A6444]"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 bg-[#1A6444] text-white rounded-lg text-sm hover:bg-[#15562f] transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
              >
                Apply
              </button>
              <button
                onClick={handleSearchReset}
                className="px-4 py-2 text-[#546661] hover:text-[#1A6444] hover:bg-gray-100 rounded-lg text-sm transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {popupState.type === 'status' && popupState.isOpen && (
          <div 
            className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[250px]"
            style={{
              top: popupState.position.top,
              left: popupState.position.left,
            }}
          >
            <div className="mb-3">
              <label className="block text-sm font-medium text-[#546661] mb-2">
                Filter by Status
              </label>
              <div>
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="radio"
                    name="status"
                    value=""
                    checked={tempStatusFilter === ''}
                    onChange={() => handleStatusFilter('')}
                    className="mr-2 text-[#1A6444] focus:ring-[#1A6444] focus:ring-2"
                  />
                  <span className="text-sm text-gray-900">All Statuses</span>
                </label>
                {statusOptions.map((status) => (
                  <label key={status} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={tempStatusFilter === status}
                      onChange={() => handleStatusFilter(status)}
                      className="mr-2 text-[#1A6444] focus:ring-[#1A6444] focus:ring-2"
                    />
                    <span className="text-sm text-gray-900">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleStatusApply}
                className="px-4 py-2 bg-[#1A6444] text-white rounded-lg text-sm hover:bg-[#15562f] transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
              >
                Apply
              </button>
              <button
                onClick={handleStatusReset}
                className="px-4 py-2 text-[#546661] hover:text-[#1A6444] hover:bg-gray-100 rounded-lg text-sm transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Overlay to close popup when clicking outside */}
        {popupState.isOpen && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setPopupState({ isOpen: false, type: null, position: { top: 0, left: 0 } })}
          />
        )}

        {/* Data rows */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {currentPageData.length > 0 ? (
            currentPageData.map((row, index) => (
              <ClaimRow 
                key={`${startIndex + index}`} 
                data={row}
                columns={columns}
              />
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>

        {/* Footer */}
        <TableFooter
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
}