import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppHeader } from "./app-header.tsx";
import { AppSidebar } from "./app-sidebar.tsx";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          // Default sidebar width (can be overridden by route-specific settings)
          "--sidebar-width": "350px",
          // Add top margin to account for the header bar
          "--sidebar-top": "28px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-hidden rounded-br-lg">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
