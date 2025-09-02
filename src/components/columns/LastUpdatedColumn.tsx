import React from "react";

export interface LastUpdatedColumnProps {
  date: string;
  time: string;
}

/**
 * Component for Last Updated column
 * Displays date on top, time below in gray
 */
export default function LastUpdatedColumn({ date, time }: LastUpdatedColumnProps) {
  return (
    <div>
      <div className="text-[#112A24] text-sm font-medium">{date}</div>
      <div className="text-[#74827F] text-[12px] mt-1 font-semibold">{time}</div>
    </div>
  );
}
