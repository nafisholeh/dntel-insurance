import React from 'react';
import { ClaimStatus } from './ClaimRow';

interface PatientFilterPopupProps {
  isOpen: boolean;
  position: { top: number; left: number };
  tempPatientNameFilter: string;
  onPatientNameChange: (name: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export const PatientFilterPopup: React.FC<PatientFilterPopupProps> = ({
  isOpen,
  position,
  tempPatientNameFilter,
  onPatientNameChange,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[300px]"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="mb-3">
        <label className="block text-sm font-medium text-[#546661] mb-2">
          Search Patient Name
        </label>
        <input
          type="text"
          value={tempPatientNameFilter}
          onChange={(e) => onPatientNameChange(e.target.value)}
          placeholder="Enter patient name..."
          className="w-full px-3 py-2 border border-[#17533b14] rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A6444] focus:border-[#1A6444]"
          autoFocus
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="px-4 py-2 bg-[#1A6444] text-white rounded-lg text-sm hover:bg-[#15562f] transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
        >
          Apply
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-[#546661] hover:text-[#1A6444] hover:bg-gray-100 rounded-lg text-sm transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

interface StatusFilterPopupProps {
  isOpen: boolean;
  position: { top: number; left: number };
  tempStatusFilter: ClaimStatus | '';
  statusOptions: ClaimStatus[];
  onStatusChange: (status: ClaimStatus | '') => void;
  onApply: () => void;
  onReset: () => void;
}

export const StatusFilterPopup: React.FC<StatusFilterPopupProps> = ({
  isOpen,
  position,
  tempStatusFilter,
  statusOptions,
  onStatusChange,
  onApply,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 min-w-[250px]"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="mb-3">
        <label className="block text-sm font-medium text-[#546661] mb-2">
          Filter by Status
        </label>
        <div>
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="status"
              value=""
              checked={tempStatusFilter === ''}
              onChange={() => onStatusChange('')}
              className="mr-2 text-[#1A6444] focus:ring-[#1A6444] focus:ring-2"
            />
            <span className="text-sm text-gray-900">All Statuses</span>
          </label>
          {statusOptions.map((status) => (
            <label key={status} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="status"
                value={status}
                checked={tempStatusFilter === status}
                onChange={() => onStatusChange(status)}
                className="mr-2 text-[#1A6444] focus:ring-[#1A6444] focus:ring-2"
              />
              <span className="text-sm text-gray-900">{status}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onApply}
          className="px-4 py-2 bg-[#1A6444] text-white rounded-lg text-sm hover:bg-[#15562f] transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
        >
          Apply
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-[#546661] hover:text-[#1A6444] hover:bg-gray-100 rounded-lg text-sm transition-colors border border-[#17533b14] drop-shadow-[0px_1px_1px_#112a241f]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
