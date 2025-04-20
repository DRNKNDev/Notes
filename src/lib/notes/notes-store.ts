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
import { parseMarkdownWithTitle } from "@/hooks/use-markdown-title";

// Counter to track initialization attempts (for debugging)
let initCounter = 0;

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
  isInitialized: boolean; // Flag to track if store has been initialized
  
  // Actions
  setBaseStoragePath: (path: string) => Promise<void>;
  loadNotesAndIndex: () => Promise<void>;
  selectNote: (noteId: string) => Promise<void>;
  createNote: (title: string, content: string) => Promise<NoteMetadata>;
  saveNote: (noteId: string, content: string, title?: string) => Promise<NoteMetadata>;
  deleteNote: (noteId: string) => Promise<boolean>;
  searchNotes: (query: string) => Promise<void>;
  clearError: () => void;
  initializeFromStorage: () => Promise<void>; // New function to initialize from storage
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
      isInitialized: false,
      
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
          
          set({ isLoading: false, isInitialized: true });
        } catch (error) {
          console.error("Error setting base storage path:", error);
          set({
            isLoading: false,
            error: `Failed to set storage path: ${error}`,
            isInitialized: false,
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
            if (!file.name) {
              return null;
            }
            try {
              const note = await readNoteFile(notesPath, file.name);
              return note;
            } catch (err) {
              console.error(`Error reading note file ${file.name}:`, err);
              return null;
            }
          });
          
          const notesWithNulls = await Promise.all(notesPromises);
          const notes = notesWithNulls.filter((note): note is Note => note !== null);
          
          // Sort notes by updatedAt (newest first)
          notes.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
          
          // Ensure notes have bodyContent for search
          const notesWithContent = notes.map(note => {
            // If bodyContent is undefined or null, set it to an empty string
            if (!note.bodyContent) {
              console.warn(`Note ${note.id} has no bodyContent, using empty string`);
              return {
                ...note,
                bodyContent: ''
              };
            }
            return note;
          });
          
          // Try to load the existing search index
          let searchIndex = await loadSearchIndex(indexPath);
          
          // If no index exists, create a new one
          if (!searchIndex) {
            searchIndex = await createSearchIndex(notesWithContent);
            if (searchIndex) {
              await saveSearchIndex(searchIndex, indexPath);
            } else {
              console.warn('Failed to create search index');
            }
          }
          
          // Update state
          set({
            notes,
            searchIndex,
            isLoading: false,
            isInitialized: true,
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
          set({ error: null }); // Clear previous errors
          
          // Create the storage paths object
          const paths: StoragePaths = {
            baseStoragePath,
            notesPath,
            indexPath,
          };

          // Determine the definitive title and parse body content
          const definitiveTitle = title?.trim() || 'Untitled'; // Use provided title or fallback
          const parsedContent = parseMarkdownWithTitle(content, definitiveTitle);
          const bodyContent = parsedContent.content; // Get content *after* H1

          // Update the note file using the definitive title and extracted body content
          const updatedNote = await updateNoteFile(
            paths, 
            noteId, 
            definitiveTitle, // Pass definitive title
            bodyContent      // Pass extracted body content
          );
          
          // Update the notes array - handle the case where the ID might have changed
          const updatedNotes = notes.map((note) => {
            // If this is the note we just updated
            if (note.id === noteId) {
              // Return the updated note with all new data
              return updatedNote;
            }
            // Ensure each note has the required Note properties
            return note as Note;
          });
          
          // Update the search index
          const updatedIndex = await updateSearchIndex(
            paths,
            updatedNotes,
            searchIndex,
            "update",
            updatedNote.id // Use the potentially new ID
          );
          
          // Update state
          const newState: Partial<NotesState> = {
            notes: updatedNotes as Note[],
            searchIndex: updatedIndex,
            activeNoteContent: updatedNote.content,
          };
          
          // If the ID has changed, update the activeNoteId
          if (noteId !== updatedNote.id && get().activeNoteId === noteId) {
            newState.activeNoteId = updatedNote.id;
          }
          
          set(newState);
          
          return updatedNote;
        } catch (error) {
          console.error(`Error saving note ${noteId}:`, error);
          set({
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
          set({ error: null }); // Clear previous errors
          
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
            error: `Failed to delete note: ${error}`,
          });
          throw error;
        }
      },
      
      // Search notes
      searchNotes: async (query: string) => {
        const { searchIndex } = get();
        
        // If query is empty, reset search state
        if (!query.trim()) {
          set({ 
            searchQuery: '',
            searchResults: [] 
          });
          return;
        }
        
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
      
      // Initialize from storage - called on app startup
      initializeFromStorage: async () => {
        // Count initialization attempts without causing re-renders
        initCounter++;
        console.log(`Initialization attempt #${initCounter}`);
        
        // Skip if already initialized or if already loading
        if (get().isInitialized || get().isLoading) {
          return;
        }
        
        const { baseStoragePath, notesPath } = get();
        
        // If we have a baseStoragePath from localStorage but no notesPath,
        // we need to reinitialize the paths
        if (baseStoragePath && !notesPath) {
          try {
            // This will set up notesPath and indexPath, and then load notes
            await get().setBaseStoragePath(baseStoragePath);
          } catch (error) {
            // Keep error logging for troubleshooting
            console.error('Error initializing from storage:', error);
          }
        }
      },
    }),
    {
      name: "notes-storage",
      // Only persist the baseStoragePath
      partialize: (state) => ({ baseStoragePath: state.baseStoragePath }),
    }
  )
);
