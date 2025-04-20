import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useThemeContext } from '@/components/theme-provider';

// Define the theme interface
export interface ThemeOption {
  name: string;
  url: string;
}

// Define the theme colors interface
export interface ThemeColors {
  primary: string;
  background: string;
  accent: string;
}

interface ThemeSelectorProps {
  themes: ThemeOption[];
  selectedTheme: ThemeOption;
  onThemeSelect: (theme: ThemeOption) => void;
  className?: string;
}

export function ThemeSelector({
  themes,
  selectedTheme,
  onThemeSelect,
  className
}: ThemeSelectorProps) {
  const { isLoadingTheme } = useThemeContext();
  const [themeColors, setThemeColors] = useState<Record<string, ThemeColors | null>>({});
  
  // Function to fetch theme preview colors
  const fetchThemeColors = async (url: string): Promise<ThemeColors | null> => {
    try {
      // Handle local theme file
      if (url.startsWith('@/')) {
        // For local themes, import them directly
        try {
          // For the default theme, use a direct import
          if (url.includes('default-theme.json')) {
            const defaultTheme = await import('@/assets/default-theme.json');
            return {
              primary: defaultTheme.cssVars?.light?.['primary'] || '#0ea5e9',
              background: defaultTheme.cssVars?.light?.['background'] || '#ffffff',
              accent: defaultTheme.cssVars?.light?.['accent'] || '#f4f4f5'
            };
          }
          return {
            primary: '#0ea5e9', // Default primary color
            background: '#ffffff',
            accent: '#f4f4f5'
          };
        } catch (error) {
          console.error('Error loading local theme:', error);
          return {
            primary: '#0ea5e9',
            background: '#ffffff',
            accent: '#f4f4f5'
          };
        }
      }
      
      const response = await fetch(url);
      if (!response.ok) return null;
      const data = await response.json();
      
      // Extract primary colors from theme
      return {
        primary: data.cssVars?.light?.['primary'] || '#000000',
        background: data.cssVars?.light?.['background'] || '#ffffff',
        accent: data.cssVars?.light?.['accent'] || '#f4f4f5'
      };
    } catch (error) {
      console.error('Error fetching theme colors:', error);
      return null;
    }
  };
  
  // Load theme colors for preview
  useEffect(() => {
    // Load colors for all themes
    const loadAllThemeColors = async () => {
      const colorPromises = themes.map(async (theme: ThemeOption) => {
        const colors = await fetchThemeColors(theme.url);
        return { url: theme.url, colors };
      });
      
      const results = await Promise.all(colorPromises);
      const colorsMap: Record<string, ThemeColors | null> = {};
      
      results.forEach((result: {url: string, colors: ThemeColors | null}) => {
        colorsMap[result.url] = result.colors;
      });
      
      setThemeColors(colorsMap);
    };
    
    loadAllThemeColors();
  }, [themes]);
  
  const handleSelect = (themeUrl: string) => {
    const theme = themes.find(t => t.url === themeUrl);
    if (theme) {
      onThemeSelect(theme);
    }
  };
  
  if (isLoadingTheme) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
        <span className="ml-2 text-sm">Loading theme...</span>
      </div>
    );
  }
  
  return (
    <div className={cn("relative w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={true}
            className="w-full justify-between"
          >
            {selectedTheme.name || "Select theme..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search themes..." />
            <CommandList>
              <CommandEmpty>No theme found.</CommandEmpty>
              <CommandGroup>
                {themes.map((theme) => (
                  <CommandItem
                    key={theme.url}
                    value={theme.url}
                    onSelect={handleSelect}
                    className="flex flex-col items-start"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTheme.url === theme.url ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-medium">{theme.name}</span>
                      </div>
                      
                      {/* Theme color swatches */}
                      {themeColors[theme.url] && (
                        <div className="flex space-x-1">
                          <div 
                            className="h-4 w-4 rounded-full border border-border" 
                            style={{ backgroundColor: themeColors[theme.url]?.primary }}
                            title="Primary Color"
                          />
                          <div 
                            className="h-4 w-4 rounded-full border border-border" 
                            style={{ backgroundColor: themeColors[theme.url]?.accent }}
                            title="Accent Color"
                          />
                          <div 
                            className="h-4 w-4 rounded-full border border-border" 
                            style={{ backgroundColor: themeColors[theme.url]?.background }}
                            title="Background Color"
                          />
                        </div>
                      )}
                    </div>
                    <span className="ml-6 text-xs text-muted-foreground">
                      {theme.url.split('/').pop()?.replace('.json', '')}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
