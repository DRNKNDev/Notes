import React, { createContext, useContext } from 'react';
import useTheme, { Theme } from '../hooks/use-theme';

type ThemeContextType = {
  // Light/dark mode
  theme: Theme; // For backward compatibility
  setTheme: (theme: Theme) => void; // For backward compatibility
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
