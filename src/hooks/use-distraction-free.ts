import { useState, useEffect } from 'react';

/**
 * Hook for managing distraction-free mode (hides UI elements)
 * This is separate from browser fullscreen API
 */
export function useDistractionFree() {
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  const toggleDistractionFree = () => {
    setIsDistractionFree(prev => !prev);
  };

  const enableDistractionFree = () => {
    setIsDistractionFree(true);
  };

  const disableDistractionFree = () => {
    setIsDistractionFree(false);
  };

  return {
    isDistractionFree,
    toggleDistractionFree,
    enableDistractionFree,
    disableDistractionFree,
  };
}
