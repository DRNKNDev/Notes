import { Outlet, createRootRoute, useMatches } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { WindowControls } from "@/components/ui/window-controls";
import { RootLayout } from "@/components/layout/root-layout";
import { useAppUpdater } from "@/lib/updater";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Route = createRootRoute({
  component: () => {
    // Get the current route to check if we're on the onboarding page
    const matches = useMatches();
    const isOnboarding = matches.some(match => match.routeId.includes('onboarding'));
    
    // Use the app updater hook
    const { updateState, applyUpdate } = useAppUpdater();
    
    return (
      <div className="flex flex-col h-screen overflow-hidden rounded-lg">
        {/* Tauri window controls header */}
        <div 
          className="h-[28px] bg-sidebar text-sidebar-foreground w-full flex items-center justify-between border-b border-muted rounded-t-lg z-10"
          data-tauri-drag-region
        >
          <WindowControls className="ml-1" />
          <div 
            className={cn(
              "text-[0.65rem] font-medium px-2",
              updateState.status === 'ready' ? "cursor-pointer hover:text-primary" : "select-none"
            )}
            onClick={updateState.status === 'ready' ? applyUpdate : undefined}
          >
            {updateState.status === 'downloading' && (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Downloading Update
              </span>
            )}
            {updateState.status === 'ready' && (
              <span className="flex items-center gap-1.5">
                Update Now
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </span>
            )}
            {(updateState.status === 'idle' || updateState.status === 'checking' || updateState.status === 'error') && (
              <span>DRNKN Notes</span>
            )}
          </div>
        </div>
        
        {/* Conditionally render either OnboardingLayout or RootLayout */}
        {isOnboarding ? (
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>
        ) : (
          <RootLayout>
            <Outlet />
          </RootLayout>
        )}
        
        {/* Show devtools in development unless explicitly disabled */}
        {import.meta.env.DEV && import.meta.env.VITE_ENABLE_ROUTER_DEVTOOLS && <TanStackRouterDevtools />}
      </div>
    );
  },
});
