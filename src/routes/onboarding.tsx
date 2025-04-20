import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThemeContext } from '@/components/theme-provider';
import { FolderOpen, Check, Moon, Sun } from 'lucide-react';
import type { Theme } from '@/hooks/use-theme';

// Define the onboarding steps
type OnboardingStep = 'directory' | 'theme';

// Create the route
export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
});

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('directory');
  const [directoryPath, setDirectoryPath] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('zinc');
  const { setTheme, effectiveTheme } = useThemeContext();
  const navigate = useNavigate();

  // Handle directory selection
  const handleDirectorySelect = () => {
    // In a real implementation, this would use Tauri's dialog API
    // For now, we'll just simulate it
    console.log('Selected directory:', directoryPath);
    setCurrentStep('theme');
  };

  // Handle theme selection
  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    // Cast to 'light' | 'dark' | 'system' as required by the setTheme function
    setTheme(theme as Theme);
  };

  // Handle completing onboarding
  const handleComplete = () => {
    // In a real implementation, save settings to persistent storage
    console.log('Completed onboarding with:', {
      directoryPath,
      theme: selectedTheme,
      mode: effectiveTheme
    });
    
    // Navigate to the notes page
    navigate({ to: '/notes' });
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
                  <div className="flex items-center mb-4">
                    <FolderOpen className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">Notes Directory</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input 
                        id="directory" 
                        placeholder="Select a directory for your notes" 
                        value={directoryPath}
                        onChange={(e) => setDirectoryPath(e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <Button variant="outline" size="icon">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
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
                          <Check className="mr-2 h-4 w-4" />
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
                onClick={handleDirectorySelect}
                disabled={!directoryPath.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
            ) : (
              <Button 
                onClick={handleComplete}
                className="bg-primary hover:bg-primary/90"
              >
                Complete
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
