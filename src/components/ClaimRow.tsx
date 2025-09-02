import React from "react";
import PatientProviderColumn from "./columns/PatientProviderColumn";
import InsuranceCarrierColumn from "./columns/InsuranceCarrierColumn";
import LastUpdatedColumn from "./columns/LastUpdatedColumn";
import UserColumn from "./columns/UserColumn";
import PmsSyncStatusColumn from "./columns/PmsSyncStatusColumn";
import { formatDisplayDate } from "../utils/dateFormatter";

// Type definitions for strict typing
export type PlanCategory = 'Primary' | 'Secondary';
export type ClaimStatus = 'PAID' | 'NCOF - RESUBMITTED' | 'PENDING' | 'DENIED' | 'PROCESSING';
export type SyncStatus = 'Synced' | 'Not synced' | 'Syncing' | 'Error';
export type ColumnKey = 'patient' | 'serviceDate' | 'insuranceCarrier' | 'amount' | 'status' | 'lastUpdated' | 'user' | 'dateSent' | 'dateSentOrig' | 'pmsSyncStatus' | 'provider';

// Additional strict types for better type safety
export type CurrencyAmount = `$${string}`;
export type TimeString = `${number}:${number} ${'AM' | 'PM'}`;

export interface ClaimRowData {
  patient: {
    name: string;
    id: string;
  };
  serviceDate: string;
  insuranceCarrier: {
    carrierName: string;
    planCategory: PlanCategory;
  };
  amount: CurrencyAmount;
  status: ClaimStatus;
  lastUpdated: {
    date: string;
    time: TimeString;
  };
  user: string;
  dateSent: string;
  dateSentOrig: string;
  pmsSyncStatus: {
    status: SyncStatus;
    description: string;
    isSynced: boolean;
  };
  provider: {
    name: string;
    id: string;
  };
}

export interface ClaimRowProps {
  data: ClaimRowData;
  columns: Array<{ key: ColumnKey; width: string }>;
}

/**
 * ClaimRow component that renders a single row of claims data
 * Uses dedicated column components for better maintainability
 */
export default function ClaimRow({ data, columns }: ClaimRowProps) {
  const gridTemplate = columns.map(col => col.width).join(' ');

  const renderCell = (columnKey: ColumnKey) => {
    switch (columnKey) {
      case 'patient':
        return <PatientProviderColumn name={data.patient.name} id={data.patient.id} />;
      
      case 'provider':
        return <PatientProviderColumn name={data.provider.name} id={data.provider.id} />;
      
      case 'insuranceCarrier':
        return (
          <InsuranceCarrierColumn 
            carrierName={data.insuranceCarrier.carrierName}
            planCategory={data.insuranceCarrier.planCategory}
          />
        );
      
      case 'lastUpdated':
        return <LastUpdatedColumn date={data.lastUpdated.date} time={data.lastUpdated.time} />;
      
      case 'user':
        return <UserColumn initials={data.user} />;
      
      case 'pmsSyncStatus':
        return (
          <PmsSyncStatusColumn 
            status={data.pmsSyncStatus.status}
            description={data.pmsSyncStatus.description}
            isSynced={data.pmsSyncStatus.isSynced}
          />
        );
      
      case 'amount':
      case 'status': {
        // Smaller font size for amount and status columns
        const value = data[columnKey as keyof ClaimRowData] as string;
        return (
          <div className="text-[#112A24] text-xs font-medium">{value}</div>
        );
      }
      
      default: {
        // For date columns (serviceDate, dateSent, dateSentOrig), format them properly
        const value = data[columnKey as keyof ClaimRowData] as string;
        const isDateColumn = columnKey === 'serviceDate' || columnKey === 'dateSent' || columnKey === 'dateSentOrig';
        const displayValue = isDateColumn ? formatDisplayDate(value) : value;
        return (
          <div className="text-[#112A24] text-sm font-medium">{displayValue}</div>
        );
      }
    }
  };

  return (
    <div 
      className="grid gap-5 px-6 border-b border-[#17533b0a]"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      {columns.map((column) => (
        <div key={column.key} className="flex items-center py-5">
          {renderCell(column.key)}
        </div>
      ))}
    </div>
  );
}

