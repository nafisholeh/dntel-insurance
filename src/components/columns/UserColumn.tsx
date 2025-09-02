import React from "react";

export interface UserColumnProps {
  initials: string;
}

/**
 * Component for User column
 * Displays circular avatar with initials
 */
export default function UserColumn({ 
  initials
}: UserColumnProps) {
  return (
    <div 
      className="w-[30px] h-[28px] bg-[#E0FEEF] rounded-[14px] flex flex-col justify-center items-center py-[7px] px-[3px] text-xs text-[#196443] font-semibold"
    >
      {initials}
    </div>
  );
}
