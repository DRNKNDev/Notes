import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useFullscreen } from "./use-fullscreen";
import { useDistractionFree } from "./use-distraction-free";
import { useNoteActions } from "./use-note-actions";

export function useKeyboardShortcuts() {
  const { toggleFullscreen } = useFullscreen();
  const { toggleDistractionFree } = useDistractionFree();
  const {
    createNewNote,
    deleteNoteAndNavigate,
    navigateTo
  } = useNoteActions();

  // Use TanStack Router for consistent route access
  const routerState = useRouterState();
  const currentMatch = routerState.matches[routerState.matches.length - 1];
  const currentNoteId =
    currentMatch?.params && 'noteId' in currentMatch.params
      ? String(currentMatch.params.noteId)
      : undefined;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Control+Command+F for browser fullscreen
      if (event.metaKey && event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        toggleFullscreen();
        return;
      }

      // Check for Command+Shift+F for distraction-free mode
      if (event.metaKey && event.shiftKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        toggleDistractionFree();
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
  }, [toggleFullscreen, toggleDistractionFree, createNewNote, deleteNoteAndNavigate, navigateTo, currentNoteId]);
}
