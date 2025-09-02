/**
 * Date formatting utilities for the insurance claims application
 * Uses date-fns library for robust date parsing and formatting
 */

import { format, parse, isValid } from 'date-fns';

/**
 * Converts a date string from MM/DD/YYYY format to "MMMM DD, YYYY" format
 * @param dateString - Date string in MM/DD/YYYY format (e.g., "01/15/2024")
 * @returns Formatted date string (e.g., "January 15, 2024")
 */
export function formatDateToLongFormat(dateString: string): string {
  // Handle empty or invalid dates
  if (!dateString || typeof dateString !== 'string') {
    return dateString || '';
  }

  try {
    // Parse MM/DD/YYYY format using date-fns
    const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
    
    // Validate the parsed date
    if (!isValid(parsedDate)) {
      console.warn('Invalid date format:', dateString);
      return dateString;
    }

    // Format to "MMMM DD, YYYY" using date-fns
    return format(parsedDate, 'MMMM dd, yyyy');
  } catch (error) {
    // If any error occurs, return the original string
    console.warn('Error formatting date:', dateString, error);
    return dateString;
  }
}

/**
 * Formats a date string for display, handling various input formats
 * @param dateString - Date string to format
 * @returns Formatted date string in "MMMM DD, YYYY" format
 */
export function formatDisplayDate(dateString: string): string {
  return formatDateToLongFormat(dateString);
}
