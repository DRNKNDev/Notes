import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThemeContext } from '@/components/theme-provider';
import { FolderOpen, CheckCircle, Moon, Sun, Loader2 } from 'lucide-react';
import type { Theme } from '@/hooks/use-theme';
import * as path from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';
import { useNotesStore } from '@/lib/notes/notes-store';
import { toast } from 'sonner';

// Define the onboarding steps
type OnboardingStep = 'directory' | 'theme';

// Create the route
export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('directory');
  const [directoryPath, setDirectoryPath] = useState<string>('');
  const [directoryName, setDirectoryName] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('zinc');
  const [isProcessing, setIsProcessing] = useState(false);
  const { setTheme, effectiveTheme } = useThemeContext();
  const navigate = useNavigate();
  
  // Get the notes store
  const { 
    setBaseStoragePath, 
    baseStoragePath,
    isLoading, 
    error, 
    clearError 
  } = useNotesStore();

  // Check if we already have a base storage path
  useEffect(() => {
    if (baseStoragePath) {
      // If we already have a base storage path, skip to the theme step
      setCurrentStep('theme');
      // Extract the directory name for display
      path.basename(baseStoragePath).then((name: string) => {
        setDirectoryName(name);
        setDirectoryPath(baseStoragePath);
      }).catch(console.error);
    }
    
    // No need to load username anymore
  }, [baseStoragePath]);

  // Handle errors from the notes store
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  // Handle directory selection
  const handleDirectorySelect = async () => {
    try {
      setIsProcessing(true);
      
      // Open the directory selection dialog
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Base Storage Directory",
      });
      
      if (selected && typeof selected === 'string') {
        setDirectoryPath(selected);
        
        // Get just the directory name for display
        const name = await path.basename(selected);
        setDirectoryName(name);
        
        setIsProcessing(false);
      } else {
        // User cancelled the dialog
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Error selecting directory:', err);
      toast.error(`Failed to select directory: ${err instanceof Error ? err.message : String(err)}`);
      setIsProcessing(false);
    }
  };

  // Handle moving to next step
  const handleNextStep = () => {
    if (currentStep === 'directory') {
      setCurrentStep('theme');
    }
  };

  // Handle theme selection
  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    // Cast to 'light' | 'dark' | 'system' as required by the setTheme function
    setTheme(theme as Theme);
  };

  // Handle completing onboarding
  const handleComplete = async () => {
    if (!directoryPath) {
      toast.error('Please select a directory first');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Set onboarding completion flag
      localStorage.setItem('isOnboardingComplete', 'true');
      
      // Initialize the notes store with the selected directory
      await setBaseStoragePath(directoryPath);
      
      // Show success message
      toast.success('Setup complete! Your notes will be stored in the selected directory.');
      
      // Navigate to the notes page
      navigate({ to: '/notes' });
    } catch (err) {
      console.error('Error completing onboarding:', err);
      toast.error(`Setup failed: ${err instanceof Error ? err.message : String(err)}`);
      setIsProcessing(false);
    }
  };

  // Available themes
  const themes = [
    { name: 'zinc', label: 'Zinc' },
    { name: 'slate', label: 'Slate' },
    { name: 'stone', label: 'Stone' },
    { name: 'gray', label: 'Gray' },
    { name: 'neutral', label: 'Neutral' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-md">
        {/* Step indicator - Linear progress bar */}
        <div className="mb-6 flex flex-col gap-1.5">
          <div className="h-1 w-full bg-muted/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out rounded-full" 
              style={{ width: currentStep === 'directory' ? '50%' : '100%' }}
            ></div>
          </div>
        </div>
        
        <Card className="w-full border-muted shadow-lg">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold">Welcome to DRNKN Notes</CardTitle>
            <CardDescription className="text-base">
              {currentStep === 'directory' 
                ? 'First, let\'s choose where to store your notes' 
                : 'Now, let\'s personalize your experience'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-6">
            {currentStep === 'directory' ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="space-y-4">
                    {directoryPath ? (
                      <div className="flex flex-col gap-2">
                        <div className="p-3 bg-background rounded-md border border-border flex items-center">
                          <div className="flex-1 truncate text-sm">
                            {directoryPath}
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleDirectorySelect} className="ml-2">
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button onClick={handleDirectorySelect} className="w-full justify-start" variant="outline">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Select Notes Directory
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Choose where your markdown notes will be stored on your device
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex items-center mb-4">
                    <div className="h-5 w-5 mr-2 bg-primary rounded-full"></div>
                    <h3 className="font-medium">Choose a Theme</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {themes.map((theme) => (
                      <Button
                        key={theme.name}
                        variant={selectedTheme === theme.name ? "default" : "outline"}
                        className={`justify-start h-auto py-2 ${selectedTheme === theme.name ? 'border-primary' : ''}`}
                        onClick={() => handleThemeSelect(theme.name)}
                      >
                        {selectedTheme === theme.name && (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        {theme.label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <div className="flex items-center mb-4">
                    {effectiveTheme === 'light' ? (
                      <Sun className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <Moon className="h-5 w-5 mr-2 text-primary" />
                    )}
                    <h3 className="font-medium">Appearance</h3>
                  </div>
                  <Tabs defaultValue={effectiveTheme} className="w-full" onValueChange={(value) => setTheme(value as Theme)}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="light" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </TabsTrigger>
                      <TabsTrigger value="dark" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-2 border-t border-muted">
            {currentStep === 'theme' ? (
              <Button variant="outline" onClick={() => setCurrentStep('directory')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            <div className="flex-1"></div>
            {currentStep === 'directory' ? (
              <Button 
                onClick={handleNextStep}
                disabled={!directoryPath.trim() || isProcessing}
                className="bg-primary hover:bg-primary/90"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                disabled={!directoryPath.trim() || isProcessing || isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isProcessing || isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
