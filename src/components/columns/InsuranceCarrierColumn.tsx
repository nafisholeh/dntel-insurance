import React from "react";
import { PlanCategory } from "../ClaimRow";

export interface InsuranceCarrierColumnProps {
  carrierName: string;
  planCategory: PlanCategory;
}

const styles = {
  Primary: { textColor: 'text-[#4A9EFF]', bgColor: 'bg-[#EBF9FE]' },
  Secondary: { textColor: 'text-[#E98E34]', bgColor: 'bg-[#FCF8CA]' }
};

/**
 * Component for Insurance Carrier column
 * Displays carrier name with plan category in a styled box below
 */
export default function InsuranceCarrierColumn({ 
  carrierName, 
  planCategory 
}: InsuranceCarrierColumnProps) {
  const { textColor, bgColor } = styles[planCategory];

  return (
    <div className="w-full">
      <div className="text-[#112A24] text-sm font-medium">{carrierName}</div>
        <div 
          className={`${textColor} text-xs font-semibold flex flex-row justify-center items-center py-1 mt-2 ${bgColor} rounded w-full`}
        >
          {planCategory}
        </div>
    </div>
  );
}
