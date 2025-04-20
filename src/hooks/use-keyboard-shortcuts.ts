import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useNotesStore } from "@/lib/notes/notes-store";
import { useFullscreen } from "./use-fullscreen";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleFullscreen } = useFullscreen();
  const { createNote } = useNotesStore();

  // Handler for creating a new note
  const handleCreateNewNote = async () => {
    try {
      const newNote = await createNote("New Note", "Write your content here...");
      // Navigate to the new note
      navigate({ to: '/notes/$noteId', params: { noteId: newNote.id } });
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  };

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
          case 'n':
          case 'N':
            // Command + N for New Note
            event.preventDefault();
            handleCreateNewNote();
            break;
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
  }, [navigate, toggleFullscreen, handleCreateNewNote]);
}
