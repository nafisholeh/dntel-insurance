import React, { Suspense } from "react";
import type { ClaimRowData, ColumnKey, ClaimStatus } from "../ClaimRow";
import type { TableColumn } from "../TableHeader";
import type { InsuranceClaimsResponse } from "../../lib/insurance-service";
import { DataRows } from "../DataRows";
import EmptyFilterResults from "../EmptyFilterResults";
import InteractiveHeader from "../client/InteractiveHeader";
import InteractiveFooter from "../client/InteractiveFooter";

interface ClaimsTableServerProps {
  columns: TableColumn[];
  data: InsuranceClaimsResponse;
}

// Server-rendered table with minimal client islands (header interactions + footer controls)
export default function ClaimsTableServer({ columns, data }: ClaimsTableServerProps) {
  const gridTemplate = columns.map((col) => col.width).join(" ");

  // Compute minWidth the same way as client table, but on the server
  const totalColumnWidth = columns.reduce((sum, col) => {
    const width = parseInt(col.width.replace("px", ""), 10);
    return sum + width;
  }, 0);
  const gapSpace = (columns.length - 1) * 20; // 20px gap between columns
  const minWidth = totalColumnWidth + gapSpace + 44; // extra padding from left and right

  const hasActiveFilters = !!(data.filters.patientName || data.filters.status);
  const showEmptyState = data.data.length === 0 && hasActiveFilters;

  const sortColumn: ColumnKey | null = (data.sorting.sortBy ?? null) as ColumnKey | null;
  const sortDirection: "asc" | "desc" | null = sortColumn ? data.sorting.direction : null;
  const statusFilter: ClaimStatus | "" = (data.filters.status ?? "") as ClaimStatus | "";
  const patientFilter: string = data.filters.patientName ?? "";

  return (
    <div
      className="w-full bg-white rounded-2xl shadow-lg overflow-hidden relative"
      style={{ maxWidth: `${minWidth}px`, height: "calc(100vh - 8rem)" }}
    >
      <div className="h-full flex flex-col">
        {/* Header (client island for interactions) */}
        <Suspense fallback={<div className="px-6 py-5 border-b">Loading controls…</div>}>
          <InteractiveHeader
            columns={columns}
            gridTemplate={gridTemplate}
            sortState={{ column: sortColumn, direction: sortDirection }}
            filterState={{ patientName: patientFilter, status: statusFilter }}
          />
        </Suspense>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          {showEmptyState ? (
            <EmptyFilterResults
              currentFilters={{
                patientName: patientFilter,
                status: statusFilter,
              }}
            />
          ) : (
            <DataRows
              data={data.data as ClaimRowData[]}
              columns={columns}
              startIndex={(data.pagination.page - 1) * data.pagination.limit}
            />
          )}
        </div>

        {/* Footer (client island for pagination + rows per page) */}
        <Suspense fallback={<div className="px-6 py-4 border-t">Loading pagination…</div>}>
          <InteractiveFooter
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            rowsPerPage={data.pagination.limit}
          />
        </Suspense>
      </div>
    </div>
  );
}

