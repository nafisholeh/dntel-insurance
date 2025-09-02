import { useState } from 'react';

export interface PopupState {
  isOpen: boolean;
  type: 'patient' | 'status' | null;
  position: {
    top: number;
    left: number;
  };
}

export interface UsePopupReturn {
  popupState: PopupState;
  openPopup: (type: 'patient' | 'status', event: React.MouseEvent) => void;
  closePopup: () => void;
}

export function usePopup(): UsePopupReturn {
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: null,
    position: { top: 0, left: 0 }
  });

  const openPopup = (type: 'patient' | 'status', event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupState({
      isOpen: true,
      type,
      position: {
        top: rect.bottom + 8,
        left: rect.left - 150, // Offset to center the popup
      }
    });
  };

  const closePopup = () => {
    setPopupState({ 
      isOpen: false, 
      type: null, 
      position: { top: 0, left: 0 } 
    });
  };

  return {
    popupState,
    openPopup,
    closePopup,
  };
}
