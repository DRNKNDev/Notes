import { useState, useEffect, useCallback, useRef } from 'react';
import { useColorThemeManager } from './use-color-theme-manager';

type Theme = 'light' | 'dark';

// We'll define theme options in themes.json

const useTheme = () => {
  // Mode state (light/dark only, no system)
  const [mode, setModeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'; // Default for SSR/initial render
    
    // First check if a theme class is already applied to the document element
    // This would have been set by our inline script in index.html
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains('dark')) {
      return 'dark';
    } else if (htmlEl.classList.contains('light')) {
      return 'light';
    }
    
    // If no class is applied yet, try localStorage
    const storedMode = localStorage.getItem('theme-mode') as Theme | null;
    if (storedMode === 'light' || storedMode === 'dark') {
      return storedMode;
    }
    
    // Last resort: Check system preference if no valid stored mode
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    // Store the system preference in localStorage for future use
    try {
      localStorage.setItem('theme-mode', systemPreference);
    } catch (e) {
      console.error("Failed to set initial theme mode in localStorage", e);
    }
    return systemPreference;
  });
  
  // Use the color theme manager for theme colors
  const { 
    currentTheme, 
    isLoading, 
    error, 
    loadTheme, 
    currentThemeKey,
    currentThemeUrl 
  } = useColorThemeManager();

  // Track if we're currently in the middle of applying a theme to prevent loops
  const isApplyingThemeRef = useRef(false);
  
  // Apply light/dark mode classes
  const applyMode = useCallback((selectedMode: Theme) => {
    // Prevent infinite loops
    if (isApplyingThemeRef.current) {
      console.log('Already applying theme, skipping mode change');
      return;
    }
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(selectedMode);
    
    // Trigger a re-application of the current theme to ensure variables are applied correctly
    if (currentTheme) {
      try {
        isApplyingThemeRef.current = true;
        // Apply theme variables directly without going through loadTheme
        // This prevents the circular dependency
        loadTheme(currentThemeKey, currentThemeUrl);
      } finally {
        // Always reset the flag when done
        setTimeout(() => {
          isApplyingThemeRef.current = false;
        }, 100);
      }
    }
  }, [currentTheme, currentThemeKey, currentThemeUrl, loadTheme]);

  // Apply mode when it changes
  useEffect(() => {
    // Apply the theme immediately
    applyMode(mode);
    
    // Update localStorage with the current theme
    try {
      localStorage.setItem('theme-mode', mode);
    } catch (e) {
      console.error("Failed to set theme mode in localStorage", e);
    }
  }, [mode, applyMode]);

  // We no longer need to listen for system theme changes since we don't have a 'system' mode

  // Set mode (light/dark/system)
  const setMode = (newMode: Theme) => {
    setModeState(newMode);
  };

  // Change color theme by key and URL
  const setColorTheme = (key: string, url?: string | null) => {
    loadTheme(key, url);
  };

  return { 
    // Light/dark mode
    mode, 
    setMode,
    
    // Color theme properties
    colorTheme: currentTheme,
    isLoadingTheme: isLoading,
    themeError: error,
    setColorTheme,
    currentThemeKey,
    currentThemeUrl
  };
};

export default useTheme;
export type { Theme }; // Only export Theme type
