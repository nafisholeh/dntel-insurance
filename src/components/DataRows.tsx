import React from 'react';
import ClaimRow, { ClaimRowData } from './ClaimRow';
import { TableColumn } from './TableHeader';

interface DataRowsProps {
  data: ClaimRowData[];
  columns: TableColumn[];
  startIndex: number;
}

export const DataRows: React.FC<DataRowsProps> = ({ 
  data, 
  columns, 
  startIndex 
}) => {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No results found
      </div>
    );
  }

  return (
    <>
      {data.map((row, index) => (
        <ClaimRow 
          key={`${startIndex + index}`} 
          data={row}
          columns={columns}
        />
      ))}
    </>
  );
};
