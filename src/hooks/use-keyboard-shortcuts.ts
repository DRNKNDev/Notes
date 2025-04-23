import { useEffect } from 'react';
import { useFullscreen } from "./use-fullscreen";
import { useNoteActions } from "./use-note-actions";

export function useKeyboardShortcuts() {
  const { toggleFullscreen } = useFullscreen();
  const { 
    createNewNote, 
    deleteNoteAndNavigate, 
    navigateTo 
  } = useNoteActions();
  
  // Current note ID from the URL
  const pathname = window.location.pathname;
  const noteIdMatch = pathname.match(/\/notes\/([^/]+)$/);
  const currentNoteId = noteIdMatch ? noteIdMatch[1] : undefined;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Control+Command+F for fullscreen
      if (event.metaKey && event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        toggleFullscreen();
        return;
      }
      
      // Check for Command + Delete for deleting current note
      if (event.metaKey && !event.ctrlKey && event.key === 'Backspace') {
        // Only if we're on a note detail page
        if (currentNoteId) {
          event.preventDefault();
          deleteNoteAndNavigate(currentNoteId);
          return;
        }
      }
      
      // Check if Command (Meta) key is pressed (without Control)
      if (event.metaKey && !event.ctrlKey) {
        switch (event.key) {
          case 'n':
          case 'N':
            // Command + N for New Note
            event.preventDefault();
            createNewNote();
            break;
          case '/':
            // Command + / for Prompt
            event.preventDefault();
            navigateTo('/prompt');
            break;
          case 'j':
          case 'J':
            // Command + J for Journal
            event.preventDefault();
            navigateTo('/journal');
            break;
          case 'l':
          case 'L':
            // Command + L for Notes
            event.preventDefault();
            navigateTo('/notes');
            break;
          case ',':
            // Command + , for Settings
            event.preventDefault();
            navigateTo('/settings', { search: { category: 'general' } });
            break;
          default:
            // Do nothing for other key combinations
            break;
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreen, createNewNote, deleteNoteAndNavigate, navigateTo, currentNoteId]);
}
