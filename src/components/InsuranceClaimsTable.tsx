"use client";

import React, { useState, useCallback } from "react";
import { TableColumn } from "./TableHeader";
import { ColumnKey, ClaimStatus } from "./ClaimRow";
import { InsuranceClaimsService, InsuranceClaimsResponse } from "../lib/insurance-service";
import { ServerDataTable } from "./ServerDataTable";

export interface InsuranceClaimsTableProps {
  initialData: InsuranceClaimsResponse;
  columns: TableColumn[];
}

export default function InsuranceClaimsTable({ initialData, columns }: InsuranceClaimsTableProps) {
  const [data, setData] = useState<InsuranceClaimsResponse>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current state for filters and sorting
  const [currentFilters, setCurrentFilters] = useState({
    patientName: initialData.filters.patientName || '',
    status: initialData.filters.status || '' as ClaimStatus | ''
  });
  
  const [currentSorting, setCurrentSorting] = useState({
    column: initialData.sorting.sortBy || null as ColumnKey | null,
    direction: initialData.sorting.direction
  });
  
  const [currentPage, setCurrentPage] = useState(initialData.pagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialData.pagination.limit);

  // Fetch data from server
  const fetchData = useCallback(async (params: {
    page?: number;
    limit?: number;
    sortBy?: ColumnKey;
    sortDirection?: 'asc' | 'desc';
    patientName?: string;
    status?: ClaimStatus | '';
  } = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const serviceParams = {
        page: params.page || currentPage,
        limit: params.limit || rowsPerPage,
        sortBy: params.sortBy || currentSorting.column || undefined,
        sortDirection: params.sortDirection || currentSorting.direction,
        patientName: params.patientName !== undefined ? params.patientName : currentFilters.patientName,
        status: params.status !== undefined ? params.status : currentFilters.status,
      };
      
      const response = await InsuranceClaimsService.getClaims(serviceParams);
      
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, rowsPerPage, currentSorting, currentFilters]);

  // Handle sorting
  const handleSort = useCallback(async (column: ColumnKey) => {
    let newDirection: 'asc' | 'desc' = 'asc';
    
    if (currentSorting.column === column) {
      // Cycle through: asc -> desc -> null (back to default)
      if (currentSorting.direction === 'asc') {
        newDirection = 'desc';
      } else if (currentSorting.direction === 'desc') {
        // Reset sorting
        setCurrentSorting({ column: null, direction: 'asc' });
        await fetchData({ sortBy: undefined, sortDirection: 'asc', page: 1 });
        setCurrentPage(1);
        return;
      }
    }
    
    setCurrentSorting({ column, direction: newDirection });
    await fetchData({ sortBy: column, sortDirection: newDirection, page: 1 });
    setCurrentPage(1);
  }, [currentSorting, fetchData]);

  // Handle filtering
  const handleFilterChange = useCallback(async (filters: {
    patientName?: string;
    status?: ClaimStatus | '';
  }) => {
    const newFilters = {
      patientName: filters.patientName !== undefined ? filters.patientName : currentFilters.patientName,
      status: filters.status !== undefined ? filters.status : currentFilters.status,
    };
    
    setCurrentFilters(newFilters);
    await fetchData({ 
      patientName: newFilters.patientName === '' ? '' : newFilters.patientName,
      status: newFilters.status === '' ? '' : newFilters.status,
      page: 1 
    });
    setCurrentPage(1);
  }, [currentFilters, fetchData]);

  // Handle pagination
  const handlePageChange = useCallback(async (page: number) => {
    setCurrentPage(page);
    await fetchData({ page });
  }, [fetchData]);

  const handleRowsPerPageChange = useCallback(async (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    await fetchData({ limit: newRowsPerPage, page: 1 });
    setCurrentPage(1);
  }, [fetchData]);

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-2xl">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1A6444]"></div>
        <span className="text-[#1A6444] font-medium">Loading...</span>
      </div>
    </div>
  );

  // Error display component
  const ErrorDisplay = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <button
              onClick={() => fetchData()}
              className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {error && <ErrorDisplay />}
      
      <div className="relative">
        {isLoading && <LoadingOverlay />}
        
        <ServerDataTable
          columns={columns}
          data={data.data}
          pagination={{
            currentPage: data.pagination.page,
            totalPages: data.pagination.totalPages,
            rowsPerPage: data.pagination.limit,
            total: data.pagination.total
          }}
          sorting={{
            column: currentSorting.column,
            direction: currentSorting.column ? currentSorting.direction : null
          }}
          filters={currentFilters}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}
