import { useState, useMemo } from 'react';
import { ClaimRowData, ColumnKey } from '../components/ClaimRow';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: ColumnKey | null;
  direction: SortDirection;
}

export interface UseDataSortReturn {
  sortState: SortState;
  handleSort: (column: ColumnKey) => void;
  getSortedData: (data: ClaimRowData[]) => ClaimRowData[];
}

export function useDataSort(): UseDataSortReturn {
  const [sortState, setSortState] = useState<SortState>({ 
    column: null, 
    direction: null 
  });

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

  const getSortedData = useMemo(() => {
    return (data: ClaimRowData[]) => {
      if (!sortState.column || !sortState.direction) return data;
      
      return [...data].sort((a, b) => {
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
    };
  }, [sortState]);

  return {
    sortState,
    handleSort,
    getSortedData,
  };
}
