import { createFileRoute } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { useThemeContext } from "@/components/theme-provider";
import { useState } from "react";
import { ThemeSelector, type ThemeOption } from "@/components/theme/theme-selector";

// Import the themes list
import themesList from "@/assets/themes.json";

// This route serves as the settings page
export const Route = createFileRoute('/settings')({  
  component: SettingsPage,
  validateSearch: (search) => {
    // Validate and parse the category search param
    const category = search.category ?? 'general';
    return {
      category: category === 'themes' ? 'themes' : 'general'
    };
  },
});



function SettingsPage() {
  // Get the current settings category from URL search params
  const { category } = Route.useSearch();
  const { mode, setMode, setColorTheme, currentThemeUrl, colorTheme } = useThemeContext();
  
  // State for available themes
  const [availableThemes] = useState<ThemeOption[]>(themesList);

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 max-w-4xl mx-auto">
          {category === "general" && (
            <form>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                  <h2 className="font-semibold text-foreground">
                    General Settings
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Configure basic application settings and preferences.
                  </p>
                </div>
                <div className="sm:max-w-3xl md:col-span-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                    <div className="col-span-full">
                      <Label
                        htmlFor="notes-directory"
                        className="text-sm font-medium text-foreground"
                      >
                        Notes Directory
                      </Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          type="text"
                          id="notes-directory"
                          name="notes-directory"
                          placeholder="/Users/username/Documents/Notes"
                          className="flex-1"
                        />
                        <Button variant="outline" type="button">
                          Browse
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        The directory where your markdown notes will be stored.
                      </p>
                    </div>
                    
                    <div className="col-span-full">
                      <div className="flex items-center gap-x-3 mt-4">
                        <Checkbox id="enable-journal" name="enable-journal" defaultChecked disabled />
                        <Label
                          htmlFor="enable-journal"
                          className="text-sm font-medium text-foreground"
                        >
                          Enable Today's Journal
                        </Label>
                        <p className="text-xs text-muted-foreground ml-2">
                          Create a daily journal note and show it in the sidebar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Editor Settings
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Customize your editing experience.
                  </p>
                </div>
                <div className="sm:max-w-3xl md:col-span-2">
                  <div className="space-y-4">
                    <div className="mb-6">
                      <Label
                        htmlFor="editor-font-size"
                        className="text-sm font-medium text-foreground"
                      >
                        Editor Font Size
                      </Label>
                      <Select name="editor-font-size" defaultValue="medium" disabled>
                        <SelectTrigger id="editor-font-size" className="mt-2">
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-x-3">
                      <Checkbox id="use-native-fullscreen" name="use-native-fullscreen" defaultChecked disabled />
                      <Label
                        htmlFor="use-native-fullscreen"
                        className="text-sm font-medium text-foreground"
                      >
                        Use native fullscreen
                      </Label>
                      <p className="text-xs text-muted-foreground ml-2">
                        Use your operating system's native fullscreen mode
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="flex items-center justify-end space-x-4">
                <Button type="button" variant="outline" className="whitespace-nowrap">
                  Reset to Defaults
                </Button>
                <Button type="submit" className="whitespace-nowrap">
                  Save Settings
                </Button>
              </div>
            </form>
          )}
          
          {category === "themes" && (
            <form>
              <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Theme Settings
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Customize the appearance of the application.
                  </p>
                </div>
                <div className="sm:max-w-3xl md:col-span-2">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        Color Theme
                      </Label>
                      
                      <ThemeSelector
                        themes={availableThemes}
                        selectedTheme={availableThemes.find(theme => 
                          (theme.url === currentThemeUrl) || 
                          (theme.name === 'Default' && !currentThemeUrl)
                        ) || availableThemes[0]}
                        onThemeSelect={(theme) => {
                          if (theme.name === 'Default' || theme.url.includes('default-theme.json')) {
                            setColorTheme('default');
                          } else {
                            setColorTheme(theme.name, theme.url);
                          }
                        }}
                        className="max-w-md"
                      />
                      
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground">
                          Current theme: {colorTheme?.name || 'Default'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">
                        Appearance Mode
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={mode === "light" ? "default" : "outline"}
                          className="h-auto flex flex-col items-center justify-center p-3 gap-2"
                          onClick={() => setMode("light")}
                        >
                          <div className="w-full h-12 rounded-md bg-background border border-border flex items-center justify-center">
                            <span className="text-xs">A</span>
                          </div>
                          <span className="text-xs font-medium">Light</span>
                        </Button>
                        
                        <Button
                          type="button"
                          variant={mode === "dark" ? "default" : "outline"}
                          className="h-auto flex flex-col items-center justify-center p-3 gap-2"
                          onClick={() => setMode("dark")}
                        >
                          <div className="w-full h-12 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="text-xs text-zinc-200">A</span>
                          </div>
                          <span className="text-xs font-medium">Dark</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="flex items-center justify-end space-x-4">
                <Button type="button" variant="outline" className="whitespace-nowrap">
                  Reset to Defaults
                </Button>
                <Button type="submit" className="whitespace-nowrap">
                  Save Settings
                </Button>
              </div>
            </form>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
