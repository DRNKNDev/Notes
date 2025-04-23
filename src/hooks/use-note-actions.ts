import { useNavigate } from '@tanstack/react-router';
import { useNotesStore } from '@/lib/notes/notes-store';
import { useState } from 'react';

/**
 * Hook that provides centralized actions for note management
 * Used by both keyboard shortcuts and UI components
 */
export function useNoteActions() {
  const navigate = useNavigate();
  const { createNote, deleteNote, notes } = useNotesStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  /**
   * Create a new note and navigate to it
   */
  const createNewNote = async () => {
    try {
      const newNote = await createNote("New Note", "Write your content here...");
      // Navigate to the new note
      navigate({ to: `/notes/${newNote.id}` });
    } catch (error) {
      console.error("Error creating new note:", error);
    }
  };
  
  /**
   * Delete a note and navigate to the next available note
   * @param noteId The ID of the note to delete
   * @returns A promise that resolves when the note is deleted
   */
  const deleteNoteAndNavigate = async (noteId: string) => {
    if (!noteId) return;
    
    setIsDeleting(true);
    
    try {
      // Find the next note to navigate to
      const currentIndex = notes.findIndex(note => note.id === noteId);
      let nextNoteId: string | undefined;
      
      if (notes.length > 1) {
        // If there's a next note, navigate to it
        if (currentIndex < notes.length - 1) {
          nextNoteId = notes[currentIndex + 1].id;
        } 
        // Otherwise navigate to the previous note
        else if (currentIndex > 0) {
          nextNoteId = notes[currentIndex - 1].id;
        }
      }
      
      // Delete the current note
      await deleteNote(noteId);
      
      // Navigate to the next note or to the notes list if no other notes
      if (nextNoteId) {
        navigate({ to: `/notes/${nextNoteId}` });
      } else {
        navigate({ to: '/notes' });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
    
    return { isDeleting };
  };
  
  /**
   * Toggle fullscreen mode
   * @param toggleFn The function to toggle fullscreen
   */
  const toggleFullscreenMode = (toggleFn: () => void) => {
    toggleFn();
  };
  
  /**
   * Navigate to a specific route
   * @param route The route to navigate to
   */
  const navigateTo = (route: string, params?: Record<string, any>) => {
    navigate({ to: route, ...params });
  };
  
  return {
    createNewNote,
    deleteNoteAndNavigate,
    toggleFullscreenMode,
    navigateTo,
    isDeleting
  };
}
