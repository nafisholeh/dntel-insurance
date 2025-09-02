import { useState, useMemo } from 'react';
import { ClaimRowData, ClaimStatus } from '../components/ClaimRow';

export interface FilterState {
  patientName: string;
  status: ClaimStatus | '';
}

export interface UseDataFilterReturn {
  filterState: FilterState;
  tempStatusFilter: ClaimStatus | '';
  tempPatientNameFilter: string;
  filteredData: ClaimRowData[];
  handleFilterChange: (newFilters: Partial<FilterState>) => void;
  setTempStatusFilter: (status: ClaimStatus | '') => void;
  setTempPatientNameFilter: (name: string) => void;
  resetFilters: () => void;
  applyTempFilters: () => void;
  initializeTempFilters: (filterType: 'patient' | 'status') => void;
}

export function useDataFilter(data: ClaimRowData[]): UseDataFilterReturn {
  const [filterState, setFilterState] = useState<FilterState>({ 
    patientName: '', 
    status: '' 
  });
  const [tempStatusFilter, setTempStatusFilter] = useState<ClaimStatus | ''>('');
  const [tempPatientNameFilter, setTempPatientNameFilter] = useState<string>('');

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilterState({ patientName: '', status: '' });
    setTempStatusFilter('');
    setTempPatientNameFilter('');
  };

  const applyTempFilters = () => {
    setFilterState({
      patientName: tempPatientNameFilter,
      status: tempStatusFilter,
    });
  };

  const initializeTempFilters = (filterType: 'patient' | 'status') => {
    if (filterType === 'status') {
      setTempStatusFilter(filterState.status);
    } else if (filterType === 'patient') {
      setTempPatientNameFilter(filterState.patientName);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesPatient = filterState.patientName === '' || 
        row.patient.name.toLowerCase().includes(filterState.patientName.toLowerCase());
      const matchesStatus = filterState.status === '' || row.status === filterState.status;
      
      return matchesPatient && matchesStatus;
    });
  }, [data, filterState]);

  return {
    filterState,
    tempStatusFilter,
    tempPatientNameFilter,
    filteredData,
    handleFilterChange,
    setTempStatusFilter,
    setTempPatientNameFilter,
    resetFilters,
    applyTempFilters,
    initializeTempFilters,
  };
}
