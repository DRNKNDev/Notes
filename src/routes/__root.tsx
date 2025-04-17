import { Outlet, createRootRoute, useMatches } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { WindowControls } from "@/components/ui/window-controls";
import { RootLayout } from "@/components/layout/root-layout";

export const Route = createRootRoute({
  component: () => {
    // Get the current route to check if we're on the onboarding page
    const matches = useMatches();
    const isOnboarding = matches.some(match => match.routeId.includes('onboarding'));
    
    return (
      <div className="flex flex-col h-screen overflow-hidden rounded-lg">
        {/* Tauri window controls header */}
        <div 
          className="h-[28px] bg-sidebar text-sidebar-foreground w-full flex items-center justify-between border-b border-muted rounded-t-lg z-10"
          data-tauri-drag-region
        >
          <WindowControls className="ml-1" />
          <div className="text-[0.65rem] font-medium px-2 select-none">DRNKN Notes</div>
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
        {import.meta.env.DEV && !import.meta.env.VITE_DISABLE_ROUTER_DEVTOOLS && <TanStackRouterDevtools />}
      </div>
    );
  },
});
