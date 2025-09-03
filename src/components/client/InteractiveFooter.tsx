"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TableFooter from "../TableFooter";

interface InteractiveFooterProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
}

export default function InteractiveFooter({ currentPage, totalPages, rowsPerPage }: InteractiveFooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === "") params.delete(k);
      else params.set(k, v);
    });
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const onPageChange = (page: number) => updateQuery({ page: String(page) });
  const onRowsPerPageChange = (limit: number) => updateQuery({ page: "1", limit: String(limit) });

  return (
    <TableFooter
      currentPage={currentPage}
      totalPages={totalPages}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      disabled={isPending}
    />
  );
}

