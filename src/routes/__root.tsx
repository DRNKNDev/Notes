import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { WindowControls } from "@/components/ui/window-controls";

// This will be created in Phase 2
// import { RootLayout } from "@/components/layout/RootLayout";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen overflow-hidden rounded-lg">
      {/* Tauri window controls header */}
      <div 
        className="h-[28px] bg-sidebar text-sidebar-foreground w-full flex items-center justify-between border-b rounded-t-lg"
        data-tauri-drag-region
      >
        <WindowControls className="ml-1" />
        <div className="text-xs font-semibold px-2 select-none">DRNKN Notes</div>
      </div>
      
      {/* 
        In Phase 2, we'll replace this with:
        <RootLayout>
          <Outlet />
        </RootLayout>
      */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      
      {/* Show devtools in development */}
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  ),
});
