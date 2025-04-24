import { createFileRoute } from "@tanstack/react-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

import { useThemeContext } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { ThemeSelector, type ThemeOption } from "@/components/theme/theme-selector";
import { useNotesStore } from "@/lib/notes/notes-store";

// Import Tauri APIs
import { open } from "@tauri-apps/plugin-dialog";

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
  
  // Get notes store state and actions
  const { baseStoragePath, setBaseStoragePath, isLoading, error, clearError } = useNotesStore();
  
  // Local state for directory path input
  const [directoryPath, setDirectoryPath] = useState<string>(baseStoragePath || "");
  const [isSaving, setIsSaving] = useState(false);
  
  // State for available themes
  const [availableThemes] = useState<ThemeOption[]>(themesList);
  
  // Update local state when baseStoragePath changes
  useEffect(() => {
    if (baseStoragePath) {
      setDirectoryPath(baseStoragePath);
    }
  }, [baseStoragePath]);

  return (
    <div className="h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-6 max-w-4xl mx-auto">
          {category === "general" && (
            <form onSubmit={(e) => e.preventDefault()}>
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
                          value={directoryPath}
                          onChange={(e) => setDirectoryPath(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button 
                          variant="outline" 
                          type="button"
                          onClick={async () => {
                            try {
                              // Open directory picker dialog
                              const selected = await open({
                                directory: true,
                                multiple: false,
                                title: "Select Notes Directory"
                              });
                              
                              if (selected && !Array.isArray(selected)) {
                                setDirectoryPath(selected);
                              }
                            } catch (err) {
                              console.error("Error selecting directory:", err);
                              toast.error("Failed to select directory");
                            }
                          }}
                          disabled={isLoading}
                        >
                          Browse
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        The directory where your markdown notes will be stored.
                      </p>
                      {error && (
                        <p className="mt-2 text-xs text-destructive">
                          Error: {error}
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-xs ml-1" 
                            onClick={clearError}
                          >
                            Clear
                          </Button>
                        </p>
                      )}
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
                <Button 
                  type="button" 
                  variant="outline" 
                  className="whitespace-nowrap"
                  onClick={() => {
                    // Reset to default directory
                    setDirectoryPath("");
                  }}
                  disabled={isLoading || isSaving}
                >
                  Reset to Defaults
                </Button>
                <Button 
                  type="button" 
                  className="whitespace-nowrap"
                  onClick={async () => {
                    if (!directoryPath) {
                      toast.error("Please select a notes directory");
                      return;
                    }
                    
                    try {
                      setIsSaving(true);
                      // Save the directory path to the store
                      await setBaseStoragePath(directoryPath);
                      toast.success("Notes directory updated successfully");
                    } catch (err) {
                      console.error("Error saving notes directory:", err);
                      toast.error("Failed to update notes directory");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          )}
          
          {category === "themes" && (
            <form onSubmit={(e) => e.preventDefault()}>
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
                          {/* Fixed light theme preview with explicit colors */}
                          <div className="w-full h-12 rounded-md bg-white flex items-center justify-center">
                            <span className="text-xs text-slate-900">A</span>
                          </div>
                          <span className="text-xs font-medium">Light</span>
                        </Button>
                        
                        <Button
                          type="button"
                          variant={mode === "dark" ? "default" : "outline"}
                          className="h-auto flex flex-col items-center justify-center p-3 gap-2"
                          onClick={() => setMode("dark")}
                        >
                          {/* Fixed dark theme preview */}
                          <div className="w-full h-12 rounded-md bg-zinc-800 flex items-center justify-center">
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
                <Button 
                  type="button" 
                  variant="outline" 
                  className="whitespace-nowrap"
                  onClick={() => {
                    // Reset to default directory
                    setDirectoryPath("");
                  }}
                  disabled={isLoading || isSaving}
                >
                  Reset to Defaults
                </Button>
                <Button 
                  type="button" 
                  className="whitespace-nowrap"
                  onClick={async () => {
                    if (!directoryPath) {
                      toast.error("Please select a notes directory");
                      return;
                    }
                    
                    try {
                      setIsSaving(true);
                      // Save the directory path to the store
                      await setBaseStoragePath(directoryPath);
                      toast.success("Notes directory updated successfully");
                    } catch (err) {
                      console.error("Error saving notes directory:", err);
                      toast.error("Failed to update notes directory");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
