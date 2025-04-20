import { useMatches, Link, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Maximize2Icon, MinimizeIcon } from "lucide-react";
import { useFullscreen } from "@/hooks/use-fullscreen";

export function AppHeader() {
  // Always call hooks at the top level
  const matches = useMatches();
  const routerState = useRouterState();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
  // Get route parameters safely
  const currentRouteMatch = routerState.matches[routerState.matches.length - 1];
  const params = currentRouteMatch?.params || {};
  const noteId = 'noteId' in params ? String(params.noteId) : undefined;
  const entryId = 'entryId' in params ? String(params.entryId) : undefined;
  
  // Get settings category
  const settingsCategory = 
    currentRouteMatch?.pathname.startsWith('/settings') && 
    currentRouteMatch.search && 
    'category' in currentRouteMatch.search && 
    currentRouteMatch.search.category === 'themes' ? 'themes' : 'general';
  
  // Get the current route path (for breadcrumb and header title)
  const currentRoute = matches.length > 0 ? matches[matches.length - 1] : null;
  const routePath = currentRoute?.pathname || "/";
  
  // Determine if we should hide the sidebar trigger based on the route
  const hideSecondarySidebar = routePath === "/prompt";
  
  // Get a user-friendly title for the current route
  const getRouteTitle = () => {
    if (routePath.startsWith("/prompt")) return "Prompt your Notes";
    if (routePath.startsWith("/journal")) {
      if (entryId) {
        // Sample data for journal entries - in a real app, this would be fetched from a data store
        const entries = [
          { id: "1", title: "Today's Journal" },
          { id: "2", title: "Yesterday's Journal" },
          { id: "3", title: "Weekly Reflection" },
          { id: "4", title: "Monthly Review" },
        ];
        const entry = entries.find(e => e.id === entryId);
        return entry ? entry.title : "Today's Journal";
      }
      return "Journal";
    }
    if (routePath.startsWith("/notes")) {
      if (noteId) {
        // Sample data for notes - in a real app, this would be fetched from a data store
        const notes = [
          { id: "1", title: "Meeting Tomorrow" },
          { id: "2", title: "Project Update" },
          { id: "3", title: "Weekend Plans" },
          { id: "4", title: "Important Announcement" },
        ];
        const note = notes.find(n => n.id === noteId);
        return note ? note.title : "Note";
      }
      return "Notes";
    }
    if (routePath.startsWith("/settings")) {
      return "Settings";
    }
    return "Notes"; // Default
  };

  // If in fullscreen mode, don't render the header
  if (isFullscreen) {
    return null;
  }
  
  return (
    <header className="sticky top-0 flex h-10 shrink-0 items-center gap-2 border-b border-muted bg-background p-2 z-10">
      {!hideSecondarySidebar && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center" sideOffset={5}>
              <div className="flex items-center justify-between">
                <p>Toggle Sidebar</p>
                <div className="text-xs text-muted ml-2">⌘⇧B</div>
              </div>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}
      <Breadcrumb>
        <BreadcrumbList>
          {routePath.startsWith("/settings") ? (
            // Settings breadcrumb
            <>
              <BreadcrumbItem className="hidden md:block text-xs">
                <BreadcrumbLink asChild>
                  <Link to="/settings" search={{ category: 'general' }}>Settings</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs">
                  {settingsCategory === 'themes' ? 'Themes' : 'General'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            // Notes breadcrumb
            <>
              <BreadcrumbItem className="hidden md:block text-xs">
                <BreadcrumbLink asChild>
                  <Link to="/notes">All Notes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs">
                  {getRouteTitle()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Spacer to push the fullscreen button to the right */}
      <div className="flex-1" />
      
      {/* Fullscreen button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <MinimizeIcon className="h-4 w-4" /> : <Maximize2Icon className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" sideOffset={5}>
          <div className="flex items-center justify-between">
            <p>Toggle Fullscreen</p>
            <div className="text-xs text-muted ml-2">⌃⌘F</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </header>
  );
}
