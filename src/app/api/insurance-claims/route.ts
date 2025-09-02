import { NextRequest, NextResponse } from 'next/server';
import { insuranceClaimsData } from '../../../data/insurance-data';
import { ClaimRowData, ClaimStatus } from '../../../components/ClaimRow';

// Helper function to filter data
function filterData(data: ClaimRowData[], patientName?: string, status?: ClaimStatus | ''): ClaimRowData[] {
  return data.filter((row) => {
    const matchesPatient = !patientName || 
      row.patient.name.toLowerCase().includes(patientName.toLowerCase());
    const matchesStatus = !status || row.status === status;
    
    return matchesPatient && matchesStatus;
  });
}

// Helper function to sort data
function sortData(data: ClaimRowData[], sortBy?: string, direction: 'asc' | 'desc' = 'asc'): ClaimRowData[] {
  if (!sortBy) return data;
  
  return [...data].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';
    
    // Handle different data types based on column
    if (sortBy === 'patient') {
      aValue = a.patient.name.toLowerCase();
      bValue = b.patient.name.toLowerCase();
    } else if (sortBy === 'serviceDate') {
      aValue = new Date(a.serviceDate).getTime();
      bValue = new Date(b.serviceDate).getTime();
    } else if (sortBy === 'lastUpdated') {
      aValue = new Date(a.lastUpdated.date).getTime();
      bValue = new Date(b.lastUpdated.date).getTime();
    } else if (sortBy === 'status') {
      aValue = a.status.toLowerCase();
      bValue = b.status.toLowerCase();
    } else if (sortBy === 'amount') {
      // Convert amount string to number for sorting
      aValue = parseFloat(a.amount.replace(/[$,]/g, ''));
      bValue = parseFloat(b.amount.replace(/[$,]/g, ''));
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// Helper function to paginate data
function paginateData(data: ClaimRowData[], page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasMore: endIndex < data.length
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters with defaults
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortDirection = (searchParams.get('sortDirection') as 'asc' | 'desc') || 'asc';
    const patientName = searchParams.get('patientName') || undefined;
    const status = (searchParams.get('status') as ClaimStatus) || undefined;
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100.' },
        { status: 400 }
      );
    }
    
    // Process data: filter -> sort -> paginate
    let processedData = insuranceClaimsData;
    
    // Apply filters
    if (patientName || status) {
      processedData = filterData(processedData, patientName, status);
    }
    
    // Apply sorting
    if (sortBy) {
      processedData = sortData(processedData, sortBy, sortDirection);
    }
    
    // Apply pagination
    const result = paginateData(processedData, page, limit);
    
    // Add metadata about filters and sorting
    const response = {
      ...result,
      filters: {
        patientName: patientName || null,
        status: status || null
      },
      sorting: {
        sortBy: sortBy || null,
        direction: sortDirection
      }
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error in insurance claims API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
