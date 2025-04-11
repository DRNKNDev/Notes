import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

// This route serves as a layout for the nested notes routes
// The sidebar is now handled by AppSidebar component
export const Route = createFileRoute('/notes')({  
  component: NotesLayout
});

function NotesLayout() {
  // Get current route state to check parameters
  const routerState = useRouterState();
  const currentRoute = routerState.matches[routerState.matches.length - 1];
  
  // Safely check if we're on a note detail route and extract the noteId
  const isNoteDetailRoute = currentRoute?.routeId.includes('$noteId');
  const noteId = isNoteDetailRoute && 'noteId' in currentRoute.params 
    ? String(currentRoute.params.noteId) 
    : undefined;
  const hasNoteId = !!noteId;

  return (
    <div className="flex-1 h-full overflow-hidden">
      {hasNoteId ? (
        <Outlet />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a note to view
        </div>
      )}
    </div>
  );
}
