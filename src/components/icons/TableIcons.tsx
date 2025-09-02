import React from 'react';

export type SortDirection = 'asc' | 'desc' | null;

interface SortIconProps {
  direction: SortDirection;
}

export const SortIcon: React.FC<SortIconProps> = ({ direction }) => (
  <div className="flex flex-col items-center ml-1">
    <svg 
      width="8" 
      height="4" 
      viewBox="0 0 8 4" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`mb-1 ${direction === 'asc' ? 'opacity-100' : 'opacity-50'}`}
    >
      <path d="M4 0L8 4H0L4 0Z" fill="currentColor"/>
    </svg>
    <svg 
      width="8" 
      height="4" 
      viewBox="0 0 8 4" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={direction === 'desc' ? 'opacity-100' : 'opacity-50'}
    >
      <path d="M4 4L0 0H8L4 4Z" fill="currentColor"/>
    </svg>
  </div>
);

interface FilterIconProps {
  active: boolean;
}

export const SearchIcon: React.FC<FilterIconProps> = ({ active }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={active ? 'opacity-100' : 'opacity-50'}
  >
    <path 
      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 14L11.1 11.1" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const FilterIcon: React.FC<FilterIconProps> = ({ active }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={active ? 'opacity-100' : 'opacity-50'}
  >
    <path 
      d="M2.66666 2.66666H13.3333L8.66666 8.66666V12.6667L7.33333 13.3333V8.66666L2.66666 2.66666Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);
