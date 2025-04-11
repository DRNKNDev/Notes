import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type EffectiveTheme = 'light' | 'dark';

const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'; // Default for SSR/initial render
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    return storedTheme || 'system';
  });
  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>('light');

  const applyTheme = useCallback((selectedTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let currentEffectiveTheme: EffectiveTheme;

    if (selectedTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentEffectiveTheme = systemPrefersDark ? 'dark' : 'light';
    } else {
      currentEffectiveTheme = selectedTheme;
    }

    root.classList.add(currentEffectiveTheme);
    setEffectiveTheme(currentEffectiveTheme); // Update effective theme state
    console.log(`Applied theme: ${currentEffectiveTheme} (Selected: ${selectedTheme})`); // Added for debugging
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('theme', theme);
      console.log(`Stored theme preference: ${theme}`); // Added for debugging
    } catch (e) {
      console.error("Failed to set theme in localStorage", e);
    }
  }, [theme, applyTheme]);

  // Listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
        console.log("System theme changed, re-applying theme if set to 'system'"); // Added for debugging
      if (theme === 'system') {
        applyTheme('system');
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
  }, [theme, applyTheme]); // Re-run if theme preference changes to/from system


  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return { theme, setTheme, effectiveTheme };
};

export default useTheme;
export type { Theme, EffectiveTheme }; // Export Theme and EffectiveTheme types
