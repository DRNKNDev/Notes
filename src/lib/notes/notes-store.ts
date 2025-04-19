import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Note, NoteMetadata, SearchResult, StoragePaths } from "./types";
import {
  createNoteFile,
  deleteNoteFile,
  ensureNotesDirectory,
  listNoteFiles,
  readNoteFile,
  updateNoteFile,
} from "./notes-manager";
import {
  createSearchIndex,
  loadSearchIndex,
  saveSearchIndex,
  searchNotes,
  updateSearchIndex,
} from "../search/lunr-search";

interface NotesState {
  // Storage paths
  baseStoragePath: string | null;
  notesPath: string | null;
  indexPath: string | null;
  
  // Notes data
  notes: NoteMetadata[];
  activeNoteId: string | null;
  activeNoteContent: string | null;
  
  // Search
  searchIndex: any | null; // Using 'any' for Lunr index type
  searchQuery: string;
  searchResults: SearchResult[];
  
  // Status
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setBaseStoragePath: (path: string) => Promise<void>;
  loadNotesAndIndex: () => Promise<void>;
  selectNote: (noteId: string) => Promise<void>;
  createNote: (title: string, content: string) => Promise<NoteMetadata>;
  saveNote: (noteId: string, content: string, title?: string) => Promise<NoteMetadata>;
  deleteNote: (noteId: string) => Promise<boolean>;
  searchNotes: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      // Initial state
      baseStoragePath: null,
      notesPath: null,
      indexPath: null,
      notes: [],
      activeNoteId: null,
      activeNoteContent: null,
      searchIndex: null,
      searchQuery: "",
      searchResults: [],
      isLoading: false,
      error: null,
      
      // Set the base storage path and initialize
      setBaseStoragePath: async (path: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Ensure the notes directory exists
          const paths = await ensureNotesDirectory(path);
          
          // Update state with the paths
          set({
            baseStoragePath: paths.baseStoragePath,
            notesPath: paths.notesPath,
            indexPath: paths.indexPath,
          });
          
          // Load notes and index
          await get().loadNotesAndIndex();
          
          set({ isLoading: false });
        } catch (error) {
          console.error("Error setting base storage path:", error);
          set({
            isLoading: false,
            error: `Failed to set storage path: ${error}`,
          });
        }
      },
      
      // Load notes and search index
      loadNotesAndIndex: async () => {
        const { notesPath, indexPath } = get();
        
        if (!notesPath || !indexPath) {
          set({ error: "Storage paths not set. Please set a base storage path first." });
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          // List all note files
          const noteFiles = await listNoteFiles(notesPath);
          
          // Read each note file
          const notesPromises = noteFiles.map(async (file) => {
            if (!file.name) return null;
            return await readNoteFile(notesPath, file.name);
          });
          
          const notesWithNulls = await Promise.all(notesPromises);
          const notes = notesWithNulls.filter((note): note is Note => note !== null);
          
          // Sort notes by updatedAt (newest first)
          notes.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
          
          // Try to load the search index
          let searchIndex = await loadSearchIndex(indexPath);
          
          // If no index exists, create one
          if (!searchIndex && notes.length > 0) {
            searchIndex = await createSearchIndex(notes);
            await saveSearchIndex(searchIndex, indexPath);
          }
          
          // Update state
          set({
            notes,
            searchIndex,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error loading notes and index:", error);
          set({
            isLoading: false,
            error: `Failed to load notes: ${error}`,
          });
        }
      },
      
      // Select a note by ID
      selectNote: async (noteId: string) => {
        const { notes, notesPath } = get();
        
        if (!notesPath) {
          set({ error: "Storage paths not set. Please set a base storage path first." });
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          
          // Find the note metadata
          const noteMetadata = notes.find((note) => note.id === noteId);
          
          if (!noteMetadata) {
            set({
              isLoading: false,
              error: `Note not found: ${noteId}`,
            });
            return;
          }
          
          // Read the note file
          const note = await readNoteFile(notesPath, noteMetadata.relativePath);
          
          // Update state
          set({
            activeNoteId: noteId,
            activeNoteContent: note.content,
            isLoading: false,
          });
        } catch (error) {
          console.error(`Error selecting note ${noteId}:`, error);
          set({
            isLoading: false,
            error: `Failed to load note: ${error}`,
          });
        }
      },
      
      // Create a new note
      createNote: async (title: string, content: string) => {
        const { baseStoragePath, notesPath, indexPath, notes, searchIndex } = get();
        
        if (!baseStoragePath || !notesPath || !indexPath) {
          throw new Error("Storage paths not set. Please set a base storage path first.");
        }
        
        try {
          set({ isLoading: true, error: null });
          
          // Create the storage paths object
          const paths: StoragePaths = {
            baseStoragePath,
            notesPath,
            indexPath,
          };
          
          // Create the note file
          const newNoteMetadata = await createNoteFile(paths, title, content);
          
          // Read the full note to get the content
          const newNote = await readNoteFile(notesPath, newNoteMetadata.relativePath);
          
          // Update the notes array
          const updatedNotes = [newNote, ...notes];
          
          // Update the search index
          // For the search index, we need to ensure all items are Note objects, not just NoteMetadata
          const updatedIndex = await updateSearchIndex(
            paths,
            [newNote], // Only pass the new note for an add operation
            searchIndex,
            "add",
            newNote.id
          );
          
          // Update state
          set({
            notes: updatedNotes,
            searchIndex: updatedIndex,
            activeNoteId: newNote.id,
            activeNoteContent: newNote.content,
            isLoading: false,
          });
          
          return newNoteMetadata;
        } catch (error) {
          console.error("Error creating note:", error);
          set({
            isLoading: false,
            error: `Failed to create note: ${error}`,
          });
          throw error;
        }
      },
      
      // Save an existing note
      saveNote: async (noteId: string, content: string, title?: string) => {
        const { baseStoragePath, notesPath, indexPath, notes, searchIndex } = get();
        
        if (!baseStoragePath || !notesPath || !indexPath) {
          throw new Error("Storage paths not set. Please set a base storage path first.");
        }
        
        try {
          set({ isLoading: true, error: null });
          
          // Create the storage paths object
          const paths: StoragePaths = {
            baseStoragePath,
            notesPath,
            indexPath,
          };
          
          // Prepare the content to be saved
          let finalContent = content;
          if (title) {
            // Extract body (everything after the first H1 or the whole content if no H1)
            const lines = content.split('\n');
            const firstH1Index = lines.findIndex(line => line.trim().startsWith('# '));
            let body = '';
            if (firstH1Index !== -1) {
              // Skip the H1 line and the first blank line after it, if exists
              let startIndex = firstH1Index + 1;
              if (lines[startIndex] && lines[startIndex].trim() === '') {
                startIndex++;
              }
              body = lines.slice(startIndex).join('\n');
            } else {
              // No H1 found, use the whole content as body
              body = content;
            }
            
            // Reconstruct with the new title
            finalContent = `# ${title}\n\n${body.trimStart()}`;
          }
          
          // Update the note file with the reconstructed content
          const updatedNoteMetadata = await updateNoteFile(
            paths,
            noteId,
            finalContent // Pass the reconstructed content
          );
          
          // Read the full updated note
          const noteFile = notes.find((note) => note.id === noteId);
          if (!noteFile) {
            throw new Error(`Note not found: ${noteId}`);
          }
          
          const updatedNote = await readNoteFile(notesPath, noteFile.relativePath);
          
          // Update the notes array
          const updatedNotes = notes.map((note) =>
            note.id === noteId ? { ...note, ...updatedNoteMetadata } : note
          );
          
          // Update the search index
          const updatedIndex = await updateSearchIndex(
            paths,
            updatedNotes.map((note) => 
              note.id === noteId ? updatedNote : note as Note
            ),
            searchIndex,
            "update",
            noteId
          );
          
          // Update state
          set({
            notes: updatedNotes,
            searchIndex: updatedIndex,
            activeNoteContent: updatedNote.content,
            isLoading: false,
          });
          
          return updatedNoteMetadata;
        } catch (error) {
          console.error(`Error saving note ${noteId}:`, error);
          set({
            isLoading: false,
            error: `Failed to save note: ${error}`,
          });
          throw error;
        }
      },
      
      // Delete a note
      deleteNote: async (noteId: string) => {
        const { baseStoragePath, notesPath, indexPath, notes, searchIndex, activeNoteId } = get();
        
        if (!baseStoragePath || !notesPath || !indexPath) {
          throw new Error("Storage paths not set. Please set a base storage path first.");
        }
        
        try {
          set({ isLoading: true, error: null });
          
          // Create the storage paths object
          const paths: StoragePaths = {
            baseStoragePath,
            notesPath,
            indexPath,
          };
          
          // Delete the note file
          await deleteNoteFile(paths, noteId);
          
          // Update the notes array
          const updatedNotes = notes.filter((note) => note.id !== noteId);
          
          // Update the search index
          const updatedIndex = await updateSearchIndex(
            paths,
            updatedNotes as Note[],
            searchIndex,
            "delete",
            noteId
          );
          
          // Update state
          const newState: Partial<NotesState> = {
            notes: updatedNotes,
            searchIndex: updatedIndex,
            isLoading: false,
          };
          
          // Clear active note if it was deleted
          if (activeNoteId === noteId) {
            newState.activeNoteId = null;
            newState.activeNoteContent = null;
          }
          
          set(newState);
          
          return true;
        } catch (error) {
          console.error(`Error deleting note ${noteId}:`, error);
          set({
            isLoading: false,
            error: `Failed to delete note: ${error}`,
          });
          throw error;
        }
      },
      
      // Search notes
      searchNotes: async (query: string) => {
        const { searchIndex } = get();
        
        if (!searchIndex) {
          set({ searchResults: [], searchQuery: query });
          return;
        }
        
        try {
          // Perform the search
          const results = await searchNotes(searchIndex, query);
          
          // Update state
          set({
            searchQuery: query,
            searchResults: results,
          });
        } catch (error) {
          console.error("Error searching notes:", error);
          set({
            error: `Search failed: ${error}`,
            searchResults: [],
          });
        }
      },
      
      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "notes-storage",
      // Only persist the baseStoragePath
      partialize: (state) => ({ baseStoragePath: state.baseStoragePath }),
    }
  )
);
