import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { WindowControls } from "@/components/ui/window-controls";
import { RootLayout } from "@/components/layout/root-layout";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen overflow-hidden rounded-lg">
      {/* Tauri window controls header */}
      <div 
        className="h-[28px] bg-sidebar text-sidebar-foreground w-full flex items-center justify-between border-b border-muted rounded-t-lg"
        data-tauri-drag-region
      >
        <WindowControls className="ml-1" />
        <div className="text-xs font-semibold px-2 select-none">DRNKN Notes</div>
      </div>
      
      {/* Use the new RootLayout component */}
      <RootLayout>
        <Outlet />
      </RootLayout>
      
      {/* Show devtools in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  ),
});
