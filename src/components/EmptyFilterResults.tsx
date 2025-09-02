import React from 'react';

interface EmptyFilterResultsProps {
  currentFilters: { 
    patientName: string; 
    status: string; 
  };
  onClearFilters: () => void;
  onShowAll: () => void;
}

const EmptyFilterResults: React.FC<EmptyFilterResultsProps> = ({ 
  currentFilters, 
  onClearFilters, 
  onShowAll 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon */}
      <div className="mb-6">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      
      {/* Heading */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Claims Found
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 mb-6 max-w-md">
        No insurance claims match your current search criteria. Try adjusting your filters or clear them to see all available claims.
      </p>
      
      {/* Current Filters Display */}
      {(currentFilters.patientName || currentFilters.status) && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Current filters:</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {currentFilters.patientName && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                Patient: &ldquo;{currentFilters.patientName}&rdquo;
              </span>
            )}
            {currentFilters.status && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Status: {currentFilters.status}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Primary Actions */}
      <div className="flex gap-3 flex-wrap justify-center">
        {/* Primary CTA */}
        <button 
          onClick={onClearFilters}
          className="px-6 py-3 bg-[#1A6444] text-white rounded-lg hover:bg-[#15562f] transition-colors font-medium"
        >
          Clear All Filters
        </button>
        
        {/* Secondary Action */}
        <button 
          onClick={onShowAll}
          className="px-4 py-2 border border-[#17533b14] text-[#546661] rounded-lg hover:text-[#1A6444] hover:bg-gray-50 transition-colors"
        >
          View All Claims
        </button>
      </div>
    </div>
  );
};

export default EmptyFilterResults;
