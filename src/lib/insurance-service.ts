import { ClaimRowData, ClaimStatus, ColumnKey } from '../components/ClaimRow';

// API Response Types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface FilterState {
  patientName?: string | null;
  status?: ClaimStatus | null;
}

export interface SortingState {
  sortBy?: ColumnKey | null;
  direction: 'asc' | 'desc';
}

export interface InsuranceClaimsResponse {
  data: ClaimRowData[];
  pagination: PaginationInfo;
  filters: FilterState;
  sorting: SortingState;
}

// Server-side data fetching (for Server Components)
export async function getInsuranceClaims(params: {
  page?: number;
  limit?: number;
  sortBy?: ColumnKey;
  sortDirection?: 'asc' | 'desc';
  patientName?: string;
  status?: ClaimStatus;
} = {}): Promise<InsuranceClaimsResponse> {
  // For server-side, we can import the data directly to avoid HTTP overhead
  const { insuranceClaimsData } = await import('../data/insurance-data');

  // Apply the same logic as the API route
  let processedData = insuranceClaimsData;

  // Apply filters
  if (params.patientName || params.status) {
    processedData = processedData.filter((row) => {
      const matchesPatient = !params.patientName ||
        row.patient.name.toLowerCase().includes(params.patientName.toLowerCase());
      const matchesStatus = !params.status || row.status === params.status;

      return matchesPatient && matchesStatus;
    });
  }

  // Apply sorting
  if (params.sortBy) {
    processedData = [...processedData].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      if (params.sortBy === 'patient') {
        aValue = a.patient.name.toLowerCase();
        bValue = b.patient.name.toLowerCase();
      } else if (params.sortBy === 'serviceDate') {
        aValue = new Date(a.serviceDate).getTime();
        bValue = new Date(b.serviceDate).getTime();
      } else if (params.sortBy === 'lastUpdated') {
        aValue = new Date(a.lastUpdated.date).getTime();
        bValue = new Date(b.lastUpdated.date).getTime();
      } else if (params.sortBy === 'status') {
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
      } else if (params.sortBy === 'amount') {
        aValue = parseFloat(a.amount.replace(/[$,]/g, ''));
        bValue = parseFloat(b.amount.replace(/[$,]/g, ''));
      }

      const direction = params.sortDirection || 'asc';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: processedData.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: processedData.length,
      totalPages: Math.ceil(processedData.length / limit),
      hasMore: endIndex < processedData.length
    },
    filters: {
      patientName: params.patientName || null,
      status: params.status || null
    },
    sorting: {
      sortBy: params.sortBy || null,
      direction: params.sortDirection || 'asc'
    }
  };
}
