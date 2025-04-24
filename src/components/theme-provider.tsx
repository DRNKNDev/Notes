import React, { createContext, useContext, useEffect } from 'react';
import useTheme, { Theme } from '../hooks/use-theme';

type ThemeContextType = {
  // Light/dark mode
  mode: Theme;
  setMode: (mode: Theme) => void;
  
  // Color theme
  colorTheme: any | null;
  isLoadingTheme: boolean;
  themeError: string | null;
  setColorTheme: (key: string, url?: string | null) => void;
  currentThemeKey: string;
  currentThemeUrl: string | null;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeState = useTheme();
  
  // Effect to ensure theme consistency between the document class and our state
  useEffect(() => {
    // This effect ensures that the document class matches our theme state
    // It's a safety check in case something else changes the document class
    const currentThemeClass = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    
    // If there's a mismatch between the document class and our state, fix it
    if (currentThemeClass !== themeState.mode) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(themeState.mode);
      console.log(`Fixed theme inconsistency: DOM had ${currentThemeClass}, state had ${themeState.mode}`);
    }
  }, [themeState.mode]);

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
