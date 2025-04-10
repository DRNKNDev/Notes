import React, { createContext, useContext } from 'react';
import useTheme, { Theme, EffectiveTheme } from '../hooks/use-theme'; // Adjust path if needed

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: EffectiveTheme;
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
