import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppHeader } from "./app-header.tsx";
import { AppSidebar } from "./app-sidebar.tsx";
import { useMatches } from "@tanstack/react-router";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  const matches = useMatches();
  const routePath = matches.length > 0 ? matches[matches.length - 1].pathname : "/";
  const hideSecondarySidebar = routePath === "/prompt";

  return (
    <SidebarProvider
      style={
        {
          // Dynamically adjust sidebar width based on the current route
          "--sidebar-width": hideSecondarySidebar ? "48px" : "350px",
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
