import React, { useEffect, useMemo } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./app-header";
import { PrimarySidebar } from "./primary-sidebar";
import { SecondarySidebar } from "./secondary-sidebar";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useNotesStore } from "@/lib/notes/notes-store";
import { useDistractionFree } from "@/hooks/use-distraction-free";
import { getLayoutConfig } from "@/types/layout";

/**
 * Main application layout component
 * Centralizes all layout logic and configuration
 */
export function AppLayout() {
  // Initialize keyboard shortcuts once at the app level
  useKeyboardShortcuts();

  // Initialize notes store once at the app level
  const { isInitialized, isLoading, initializeFromStorage } = useNotesStore();

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeFromStorage();
    }
  }, [isInitialized, isLoading, initializeFromStorage]);

  // Get current route using TanStack Router
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Get distraction-free mode state
  const { isDistractionFree } = useDistractionFree();

  // Determine layout configuration based on current route
  const layoutConfig = useMemo(() => {
    const config = getLayoutConfig(pathname);

    // Override if in distraction-free mode
    if (isDistractionFree) {
      return {
        ...config,
        showPrimarySidebar: false,
        showSecondarySidebar: false,
        showHeader: false,
        isDistractionFree: true,
      };
    }

    return config;
  }, [pathname, isDistractionFree]);

  // Calculate sidebar width for CSS variable
  const sidebarWidth = layoutConfig.showSecondarySidebar ? "350px" : "48px";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--sidebar-top": "28px",
        } as React.CSSProperties
      }
    >
      {/* Primary sidebar (icon sidebar - 48px) */}
      {layoutConfig.showPrimarySidebar && <PrimarySidebar />}

      {/* Secondary sidebar (content sidebar - 350px) */}
      {layoutConfig.showSecondarySidebar && (
        <SecondarySidebar content={layoutConfig.secondarySidebarContent} />
      )}

      {/* Main content area */}
      <SidebarInset className="flex flex-col border-l border-muted">
        {/* Header with breadcrumbs */}
        {layoutConfig.showHeader && <AppHeader />}

        {/* Page content */}
        <div className="flex-1 overflow-hidden rounded-br-lg">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
