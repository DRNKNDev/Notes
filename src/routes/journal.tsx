import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

// This route serves as a layout for the nested journal routes
// The sidebar is now handled by AppSidebar component
export const Route = createFileRoute('/journal')({  
  component: JournalLayout
});

function JournalLayout() {
  // Get current route state to check parameters
  const routerState = useRouterState();
  const currentRoute = routerState.matches[routerState.matches.length - 1];
  
  // Safely check if we're on a journal entry detail route and extract the entryId
  const isEntryDetailRoute = currentRoute?.routeId.includes('$entryId');
  const entryId = isEntryDetailRoute && 'entryId' in currentRoute.params 
    ? String(currentRoute.params.entryId) 
    : undefined;
  const hasEntryId = !!entryId;

  return (
    <div className="flex-1 h-full overflow-hidden">
      {hasEntryId ? (
        <Outlet />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a journal entry to view
        </div>
      )}
    </div>
  );
}
