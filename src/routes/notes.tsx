import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router';
import { useNotesStore } from '@/lib/notes/notes-store';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// This route serves as a layout for the nested notes routes
// The sidebar is now handled by AppSidebar component
export const Route = createFileRoute('/notes')({  
  component: NotesLayout
});

function NotesLayout() {
  // Get router for navigation and current route info
  const router = useRouter();
  const navigate = router.navigate;
  
  // Access notes store - only get what we need
  const { 
    isLoading, 
    isInitialized,
    initializeFromStorage,
    notes
  } = useNotesStore();
  
  // Initialize store on component mount - this will only run once
  useEffect(() => {
    // Only attempt to initialize if not already initialized
    if (!isInitialized && !isLoading) {
      initializeFromStorage();
    }
  }, [isInitialized, isLoading, initializeFromStorage]);
  
  // Use router to get current route info instead of window.location
  // This ensures we have the correct route info after navigation
  const currentRoute = router.state.location.pathname;
  const noteIdMatch = currentRoute.match(/\/notes\/([^/]+)$/);
  const noteId = noteIdMatch ? noteIdMatch[1] : undefined;
  const hasNoteId = !!noteId;
  
  // Redirect to the first note if no note is selected and notes are loaded
  useEffect(() => {
    // Only redirect if we're at exactly /notes (not a sub-route) and have notes
    if (currentRoute === '/notes' && isInitialized && !isLoading && notes.length > 0) {
      // Find the first note to redirect to
      const firstNote = notes[0];
      navigate({ to: `/notes/${firstNote.id}` });
    }
  }, [currentRoute, notes, isInitialized, isLoading, navigate]);
  
  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex-1 h-full overflow-hidden flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="flex-1 h-full overflow-hidden">
      {hasNoteId ? (
        <Outlet />
      ) : notes.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No notes found. Create a new note to get started.
        </div>
      ) : (
        // This is a transitional state that should be very brief
        // We're showing the outlet instead of a loading indicator to prevent flashing
        <Outlet />
      )}
    </div>
  );
}
