import { useState, useMemo } from 'react';

export interface UsePaginationProps {
  defaultRowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  rowsPerPage: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  getPaginatedData: (data: T[]) => T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>({
  defaultRowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
}: UsePaginationProps = {}): UsePaginationReturn<T> {
  const [currentPage, setCurrentPageState] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(defaultRowsPerPage);

  const setCurrentPage = (page: number) => {
    setCurrentPageState(page);
    onPageChange?.(page);
  };

  const setRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPageState(newRowsPerPage);
    setCurrentPageState(1); // Reset to first page when changing rows per page
    onRowsPerPageChange?.(newRowsPerPage);
  };

  const getPaginatedData = useMemo(() => {
    return (data: T[]) => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return data.slice(startIndex, endIndex);
    };
  }, [currentPage, rowsPerPage]);

  const memoizedValues = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    return {
      startIndex,
      endIndex,
    };
  }, [currentPage, rowsPerPage]);

  return {
    currentPage,
    rowsPerPage,
    setCurrentPage,
    setRowsPerPage,
    getPaginatedData,
    totalPages: 0, // This will be calculated in the component based on filtered data
    ...memoizedValues,
  };
}
