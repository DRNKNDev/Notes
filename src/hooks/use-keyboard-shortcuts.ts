import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useFullscreen } from './use-fullscreen';
import { useNotesStore } from '@/lib/notes/notes-store';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleFullscreen } = useFullscreen();
  // Select state individually to prevent new object creation on each render
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const activeNoteId = useNotesStore((state) => state.activeNoteId);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Control+Command+F for fullscreen
      if (event.metaKey && event.ctrlKey && (event.key === 'f' || event.key === 'F')) {
        event.preventDefault();
        toggleFullscreen();
        return;
      }
      
      // Check if Command (Meta) key is pressed (without Control)
      if (event.metaKey && !event.ctrlKey) {
        switch (event.key) {
          case '/':
            // Command + / for Prompt
            event.preventDefault();
            navigate({ to: '/prompt' });
            break;
          case 'j':
          case 'J':
            // Command + J for Journal
            event.preventDefault();
            navigate({ to: '/journal' });
            break;
          case 'l':
          case 'L':
            // Command + L for Notes
            event.preventDefault();
            navigate({ to: '/notes' });
            break;
          case ',':
            // Command + , for Settings
            event.preventDefault();
            navigate({ to: '/settings', search: { category: 'general' } });
            break;
          case 'Backspace':
            if (activeNoteId) { // Check activeNoteId
              event.preventDefault(); 
              try {
                deleteNote(activeNoteId); // Use activeNoteId
                // Navigate away immediately
                navigate({ to: '/notes' }); 
              } catch (error) { 
                console.error("Shortcut delete failed:", error);
                // Consider adding a user-facing toast message here
              }
            }
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
  }, [navigate, toggleFullscreen, deleteNote, activeNoteId]);
}
