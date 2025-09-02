import React from "react";
import { SyncStatus } from "../ClaimRow";

export interface PmsSyncStatusColumnProps {
  status: SyncStatus;
  description: string;
  isSynced: boolean;
}

// Move icons outside component to prevent re-creation on each render
const NotSyncedIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="6.5" stroke="#838580" strokeWidth="1"/>
    <path d="M7.5 4.5V8.5" stroke="#838580" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="7.5" cy="10.5" r="0.5" fill="#838580"/>
  </svg>
);

const SyncedIcon = () => (
  <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.41666 7.58334L5.74999 9.91667L11.5833 4.08334" stroke="#01A151" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Component for PMS Sync Status column
 * Displays icon + status text with description below in a styled container
 */
export default function PmsSyncStatusColumn({ 
  status, 
  description, 
  isSynced = false 
}: PmsSyncStatusColumnProps) {
  return (
    <div className="text-sm w-full">
      <div 
        className={`flex flex-row justify-center items-center py-1 gap-[6px] h-[24px] rounded ${
          isSynced ? 'bg-[#F0F9EB]' : 'bg-[#EAEAEA]'
        }`}
      >
        {isSynced ? <SyncedIcon /> : <NotSyncedIcon />}
        <span className={`text-xs font-semibold ${isSynced ? 'text-[#01A151]' : 'text-[#838580]'}`}>
          {status}
        </span>
      </div>
      <div className="text-[#546661] text-xs font-medium mt-1">{description}</div>
    </div>
  );
}
