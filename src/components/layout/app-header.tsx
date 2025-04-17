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
  const matches = useMatches();
  
  // Get the current route path (for breadcrumb and header title)
  const currentRoute = matches.length > 0 ? matches[matches.length - 1] : null;
  const routePath = currentRoute?.pathname || "/";
  
  // Get current router state to safely check for route parameters
  const routerState = useRouterState();
  const currentRouteMatch = routerState.matches[routerState.matches.length - 1];
  
  // Safely extract route parameters
  const isNoteDetailRoute = currentRouteMatch?.routeId.includes('$noteId');
  const noteId = isNoteDetailRoute && 'noteId' in currentRouteMatch.params 
    ? String(currentRouteMatch.params.noteId) 
    : undefined;
    
  const isJournalEntryRoute = currentRouteMatch?.routeId.includes('$entryId');
  const entryId = isJournalEntryRoute && 'entryId' in currentRouteMatch.params 
    ? String(currentRouteMatch.params.entryId) 
    : undefined;
  
  // Determine if we should hide the sidebar trigger based on the route
  const hideSecondarySidebar = routePath === "/prompt";
  
  // Use the fullscreen hook
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  
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
        return entry ? entry.title : "Journal Entry";
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
    return "Notes"; // Default
  };

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
                <div className="text-xs text-muted-foreground ml-2">⌘⇧B</div>
              </div>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}
      <Breadcrumb>
        <BreadcrumbList>
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
            className="size-7" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <MinimizeIcon className="size-4 text-muted-foreground" />
            ) : (
              <Maximize2Icon className="size-4 text-muted-foreground" />
            )}
            <span className="sr-only">Toggle Fullscreen</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" sideOffset={5}>
          <div className="flex items-center justify-between">
            <p>Toggle Fullscreen</p>
            <div className="text-xs text-muted-foreground ml-2">⌃⌘F</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </header>
  );
}
