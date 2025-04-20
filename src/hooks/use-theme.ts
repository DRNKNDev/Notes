import { useState, useEffect, useCallback } from 'react';
import { useColorThemeManager } from './use-color-theme-manager';

type Theme = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

// We'll define theme options in themes.json

const useTheme = () => {
  // Mode state (light/dark/system)
  const [mode, setModeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'; // Default for SSR/initial render
    const storedMode = localStorage.getItem('theme-mode') as Theme | null;
    return storedMode || 'system';
  });
  
  // Effective theme state (light/dark)
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light');
  
  // Use the color theme manager for theme colors
  const { 
    currentTheme, 
    isLoading, 
    error, 
    loadTheme, 
    currentThemeKey,
    currentThemeUrl 
  } = useColorThemeManager();

  // Apply light/dark mode classes
  const applyMode = useCallback((selectedMode: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let currentEffectiveTheme: EffectiveTheme;

    if (selectedMode === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentEffectiveTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      currentEffectiveTheme = selectedMode;
    }

    root.classList.add(currentEffectiveTheme);
    setEffectiveTheme(currentEffectiveTheme); // Update effective theme state
    console.log(`Applied mode: ${currentEffectiveTheme} (Selected: ${selectedMode})`);
  }, []);

  // Apply mode when it changes
  useEffect(() => {
    applyMode(mode);
    try {
      localStorage.setItem('theme-mode', mode);
      console.log(`Stored theme mode preference: ${mode}`);
    } catch (e) {
      console.error("Failed to set theme mode in localStorage", e);
    }
  }, [mode, applyMode]);

  // Listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      console.log("System theme changed, re-applying mode if set to 'system'");
      if (mode === 'system') {
        applyMode('system');
      }
    };

    // Check if addEventListener is supported
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) { // Deprecated but fallback
      mediaQuery.addListener(handleChange);
    }

    // Cleanup listener on unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) { // Deprecated but fallback
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [mode, applyMode]); // Re-run if theme preference changes to/from system

  // Set mode (light/dark/system)
  const setMode = (newMode: Theme) => {
    setModeState(newMode);
  };

  // Change color theme by key and URL
  const setColorTheme = (key: string, url?: string | null) => {
    loadTheme(key, url);
  };

  return { 
    // For backward compatibility
    theme: mode, 
    setTheme: setMode,
    
    // New explicit naming
    mode, 
    setMode, 
    effectiveTheme,
    
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
export type { Theme, EffectiveTheme }; // Export Theme and EffectiveTheme types
