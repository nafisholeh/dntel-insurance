import React from "react";

export interface PatientProviderColumnProps {
  name: string;
  id: string;
}

/**
 * Reusable component for Patient and Provider columns
 * Displays name on top, ID below in gray
 */
export default function PatientProviderColumn({ name, id }: PatientProviderColumnProps) {
  return (
    <div>
      <div className="text-[#112A24] text-sm font-medium">{name}</div>
      <div className="text-[#B3B3B3] text-[12px] mt-1 font-semibold">ID: {id}</div>
    </div>
  );
}
