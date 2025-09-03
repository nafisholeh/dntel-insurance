"use client";

import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TableHeader, TableColumn } from "../TableHeader";
import { ColumnKey, ClaimStatus } from "../ClaimRow";
import { usePopup } from "../../hooks/usePopup";

// Dynamic import popups to reduce initial bundle
const PatientFilterPopup = dynamic(
  () => import("../FilterPopups").then((m) => m.PatientFilterPopup),
  { ssr: false, loading: () => <div className="px-3 py-2">Loading…</div> }
);
const StatusFilterPopup = dynamic(
  () => import("../FilterPopups").then((m) => m.StatusFilterPopup),
  { ssr: false, loading: () => <div className="px-3 py-2">Loading…</div> }
);

interface InteractiveHeaderProps {
  columns: TableColumn[];
  gridTemplate: string;
  sortState: { column: ColumnKey | null; direction: "asc" | "desc" | null };
  filterState: { patientName: string; status: string };
}

export default function InteractiveHeader({
  columns,
  gridTemplate,
  sortState,
  filterState,
}: InteractiveHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const popup = usePopup();

  // temp filter states
  const [tempPatientNameFilter, setTempPatientNameFilter] = useState<string>("");
  const [tempStatusFilter, setTempStatusFilter] = useState<ClaimStatus | "">("");

  // Keep temp filter state in sync when opening popups
  const handleFilterIconClick = (type: "patient" | "status", e: React.MouseEvent) => {
    if (type === "patient") setTempPatientNameFilter(filterState.patientName || "");
    if (type === "status") setTempStatusFilter((filterState.status as ClaimStatus | "") || "");
    popup.openPopup(type, e);
  };

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    });
    // reset page to 1 on any sort/filter change
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Sorting logic (cycle asc -> desc -> none)
  const onSort = (column: ColumnKey) => {
    if (sortState.column !== column) {
      updateQuery({ sortBy: column, sortDirection: "asc" });
      return;
    }
    if (sortState.direction === "asc") {
      updateQuery({ sortBy: column, sortDirection: "desc" });
      return;
    }
    // remove sort when going from desc -> none
    updateQuery({ sortBy: null, sortDirection: null });
  };

  // Filters
  const handleSearchSubmit = () => {
    updateQuery({ patientName: tempPatientNameFilter || null });
    popup.closePopup();
  };
  const handleSearchReset = () => {
    setTempPatientNameFilter("");
    updateQuery({ patientName: null });
    popup.closePopup();
  };
  const handleStatusApply = () => {
    updateQuery({ status: tempStatusFilter || null });
    popup.closePopup();
  };
  const handleStatusReset = () => {
    setTempStatusFilter("");
    updateQuery({ status: null });
    popup.closePopup();
  };

  const computedDirection: "asc" | "desc" | null = sortState.column ? sortState.direction : null;

  return (
    <div className="relative">
      <TableHeader
        columns={columns}
        gridTemplate={gridTemplate}
        sortState={{ column: sortState.column, direction: computedDirection }}
        filterState={filterState}
        disabled={isPending}
        onSort={onSort}
        onFilterIconClick={handleFilterIconClick}
      />

      {/* Popups */}
      <PatientFilterPopup
        isOpen={popup.popupState.type === "patient" && popup.popupState.isOpen && !isPending}
        position={popup.popupState.position}
        tempPatientNameFilter={tempPatientNameFilter}
        onPatientNameChange={setTempPatientNameFilter}
        onApply={handleSearchSubmit}
        onReset={handleSearchReset}
      />

      <StatusFilterPopup
        isOpen={popup.popupState.type === "status" && popup.popupState.isOpen && !isPending}
        position={popup.popupState.position}
        tempStatusFilter={tempStatusFilter}
        statusOptions={["PAID","NCOF - RESUBMITTED","PENDING","DENIED","PROCESSING"] as ClaimStatus[]}
        onStatusChange={(v) => setTempStatusFilter(v as ClaimStatus | "")}
        onApply={handleStatusApply}
        onReset={handleStatusReset}
      />

      {/* Click-away overlay */}
      {popup.popupState.isOpen && !isPending && (
        <div className="fixed inset-0 z-40" onClick={popup.closePopup} />
      )}
    </div>
  );
}

