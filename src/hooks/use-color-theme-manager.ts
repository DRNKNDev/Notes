import { useState, useEffect, useCallback, useRef } from 'react';
import defaultTheme from '@/assets/default-theme.json';

// Define the structure of the theme object based on the Shadcn theme format
interface ColorTheme {
  name: string;
  $schema?: string;
  type?: string;
  cssVars: {
    theme?: Record<string, string>;
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  css?: any;
  dependencies?: string[];
  registryDependencies?: string[];
  [key: string]: any;
}

// Define fonts that should not be overridden by themes
const PROTECTED_VARIABLES = new Set(['--font-sans', '--font-serif', '--font-mono']);
// We'll use the default theme directly instead of loading it by URL
const DEFAULT_THEME_KEY = 'default';

// Helper function to apply theme variables to the document
const applyThemeVariables = (theme: ColorTheme) => {
  const root = document.documentElement;
  const lightColors = theme.cssVars.light;
  const darkColors = theme.cssVars.dark;
  const commonColors = theme.cssVars.theme || {};
  
  // Check if dark mode is currently active
  const isDarkMode = root.classList.contains('dark');

  // Apply common theme variables to :root
  for (const [key, value] of Object.entries(commonColors)) {
    const cssVar = `--${key}`;
    if (!PROTECTED_VARIABLES.has(cssVar)) {
      root.style.setProperty(cssVar, value);
    }
  }

  // Apply the appropriate theme variables based on current mode
  if (isDarkMode) {
    // Apply dark theme variables directly to :root when in dark mode
    for (const [key, value] of Object.entries(darkColors)) {
      const cssVar = `--${key}`;
      if (!PROTECTED_VARIABLES.has(cssVar)) {
        root.style.setProperty(cssVar, value);
      }
    }
  } else {
    // Apply light theme variables when in light mode
    for (const [key, value] of Object.entries(lightColors)) {
      const cssVar = `--${key}`;
      if (!PROTECTED_VARIABLES.has(cssVar)) {
        root.style.setProperty(cssVar, value);
      }
    }
  }

  // Still create the style sheet for future dark mode toggling
  let darkStyleSheet = document.getElementById('dark-theme-styles');
  if (!darkStyleSheet) {
    darkStyleSheet = document.createElement('style');
    darkStyleSheet.id = 'dark-theme-styles';
    document.head.appendChild(darkStyleSheet);
  }

  let darkStyles = '.dark {';
  
  // Apply common theme variables to dark mode too
  for (const [key, value] of Object.entries(commonColors)) {
    const cssVar = `--${key}`;
    if (!PROTECTED_VARIABLES.has(cssVar)) {
      darkStyles += `${cssVar}: ${value}; `;
    }
  }
  
  // Apply dark-specific variables
  for (const [key, value] of Object.entries(darkColors)) {
    const cssVar = `--${key}`;
    if (!PROTECTED_VARIABLES.has(cssVar)) {
      darkStyles += `${cssVar}: ${value}; `; // Added space for clarity
    }
  }
  darkStyles += '}';
  darkStyleSheet.textContent = darkStyles;

  console.log(`Applied theme: ${theme.name} (Dark mode: ${isDarkMode})`);
};

// Custom hook for managing color themes
export const useColorThemeManager = () => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Track if we're currently applying a theme to prevent loops
  const isApplyingThemeRef = useRef(false);
  
  // Initialize theme key from localStorage
  const [themeKey, setThemeKey] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME_KEY;
    
    // Load saved theme key from local storage or use the default
    return localStorage.getItem('colorThemeKey') || DEFAULT_THEME_KEY;
  });
  
  // For remote themes, we'll store the URL
  const [themeUrl, setThemeUrl] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('colorThemeUrl');
  });

  // Function to load and apply a theme
  const loadTheme = useCallback(async (key: string, url?: string | null) => {
    // Prevent infinite loops if we're already applying a theme
    if (isApplyingThemeRef.current) {
      console.log('Already applying theme, skipping loadTheme call');
      return;
    }
    
    isApplyingThemeRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      let themeData: ColorTheme;
      
      // Handle default theme specially
      if (key === DEFAULT_THEME_KEY) {
        themeData = defaultTheme as ColorTheme;
        setThemeUrl(null);
      } else if (url) {
        // Remote URL - use fetch
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch theme: ${response.statusText} from ${url}`);
        }
        themeData = await response.json();
        setThemeUrl(url);
      } else {
        throw new Error('No theme URL provided for non-default theme');
      }

      // Basic validation for Shadcn theme format
      if (!themeData || !themeData.name || !themeData.cssVars || !themeData.cssVars.light || !themeData.cssVars.dark) {
        console.error("Invalid theme data:", themeData);
        throw new Error('Invalid theme data structure');
      }

      setCurrentTheme(themeData);
      applyThemeVariables(themeData);
      
      // Save theme information
      localStorage.setItem('colorThemeKey', key);
      if (url) {
        localStorage.setItem('colorThemeUrl', url);
      } else {
        localStorage.removeItem('colorThemeUrl');
      }
      setThemeKey(key);
    } catch (err) {
      console.error('Error loading theme:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setCurrentTheme(null); // Reset theme on error
      // Optionally clear local storage if the saved URL is invalid
      // localStorage.removeItem('colorThemeUrl');
      // setThemeUrl(DEFAULT_THEME_URL); // Revert to default? Needs careful thought.
    } finally {
      setIsLoading(false);
      // Reset the flag after a short delay to ensure all state updates have completed
      setTimeout(() => {
        isApplyingThemeRef.current = false;
      }, 100);
    }
  }, []);

  // Function to explicitly set and load a theme by key and URL
  const changeTheme = useCallback((key: string, url?: string | null) => {
    setThemeKey(key); // Update the theme key
    loadTheme(key, url); // Immediately try loading
  }, [loadTheme]);

  // Effect to load the theme when the component mounts
  useEffect(() => {
    // Load the theme on mount
    loadTheme(themeKey, themeUrl);
  }, [themeKey, themeUrl, loadTheme]);

  return {
    currentTheme,
    isLoading,
    error,
    loadTheme: changeTheme, // Expose the function to change theme
    currentThemeKey: themeKey, // Expose the currently active theme key
    currentThemeUrl: themeUrl // Expose the currently active URL
  };
};
