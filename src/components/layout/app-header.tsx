import { Link, useRouterState } from "@tanstack/react-router";
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
import { useNotesStore } from "@/lib/notes/notes-store";
import { format } from "date-fns";

export function AppHeader() {
  // Use TanStack Router for consistent route access
  const routerState = useRouterState();
  const { notes } = useNotesStore();

  // Get route information
  const currentMatch = routerState.matches[routerState.matches.length - 1];
  const pathname = routerState.location.pathname;
  const params = currentMatch?.params || {};
  const search = currentMatch?.search || {};

  // Extract route parameters
  const noteId = 'noteId' in params ? String(params.noteId) : undefined;
  const entryId = 'entryId' in params ? String(params.entryId) : undefined;
  const settingsCategory = 'category' in search ? String(search.category) : 'general';

  // Determine if we should show the sidebar trigger
  const showSidebarTrigger = !pathname.startsWith("/prompt") && !pathname.startsWith("/journal");

  // Get the current note title from the actual notes store
  const currentNote = noteId ? notes.find(n => n.id === noteId) : undefined;

  // Format journal entry date for display
  const formatJournalDate = (dateId: string) => {
    try {
      const date = new Date(dateId);
      return format(date, "MMMM d, yyyy");
    } catch {
      return "Today's Journal";
    }
  };

  // Get breadcrumb title based on route
  const getBreadcrumbTitle = () => {
    if (pathname.startsWith("/prompt")) return "Prompt your Notes";
    if (pathname.startsWith("/journal")) {
      return entryId ? formatJournalDate(entryId) : "Journal";
    }
    if (pathname.startsWith("/notes")) {
      return currentNote?.title || "Note";
    }
    if (pathname.startsWith("/settings")) {
      return settingsCategory === 'themes' ? 'Themes' : 'General';
    }
    return "Notes";
  };

  return (
    <header className="sticky top-0 flex h-10 shrink-0 items-center gap-2 border-b border-muted bg-background p-2 z-10">
      {showSidebarTrigger && (
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
          {pathname.startsWith("/settings") ? (
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
            // Default breadcrumb for notes, journal, prompt
            <>
              <BreadcrumbItem className="hidden md:block text-xs">
                <BreadcrumbLink asChild>
                  <Link to="/notes">All Notes</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs">
                  {getBreadcrumbTitle()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
