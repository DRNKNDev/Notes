import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/lib/notes/notes-store";
import { Note } from "@/lib/notes/types";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

// This route handles displaying a specific note by its ID
export const Route = createFileRoute('/notes/$noteId')({  
  component: NoteView
});

function NoteView() {
  const { noteId } = Route.useParams();
  const navigate = useNavigate();
  
  // Get notes and actions from the store
  const { 
    notes, 
    saveNote, 
    deleteNote, 
    isLoading, 
    error 
  } = useNotesStore();
  
  // State for tracking if we're currently saving
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for the combined markdown content in the editor
  // Initialize with null to indicate content is not yet loaded
  const [editorMarkdown, setEditorMarkdown] = useState<string | null>(null);
  
  // State for the current note title
  const [currentTitle, setCurrentTitle] = useState<string>('');
  
  // Track if we've already loaded this note to prevent double loading
  const loadedNoteIdRef = useRef<string | null>(null);
  // Ref to track if the initial load is complete to prevent auto-save on mount
  const isInitialLoadCompleteRef = useRef(false);
  
  // Get fullscreen state
  const { isFullscreen } = useFullscreen();
  
  // Find the note with the matching ID
  const note = notes.find(note => note.id === noteId) as Note | undefined;
  
  // Initialize editor markdown when noteId changes
  useEffect(() => {
    // Skip if we've already loaded this note
    if (loadedNoteIdRef.current === noteId) return;
    
    // Reset initial load flag
    isInitialLoadCompleteRef.current = false;
    
    // Reset state when noteId changes
    setEditorMarkdown(null);
    setCurrentTitle('');
    
    if (note) {
      // Mark this note as loaded
      loadedNoteIdRef.current = noteId;
      
      // Construct initial editor markdown
      const initialTitle = note.title || 'Untitled';
      
      // Check if bodyContent already starts with a title
      let initialContent = note.bodyContent || '';
      
      // Ensure consistent line endings (convert CRLF to LF)
      initialContent = initialContent.replace(/\r\n/g, '\n');
      
      // Remove any existing H1 header to prevent duplication
      if (initialContent.trim().startsWith('# ')) {
        // Content already has a header, use it as is
        const initialMarkdown = initialContent;
        setEditorMarkdown(initialMarkdown);
      } else {
        // Content doesn't have a header, add one
        const initialMarkdown = `# ${initialTitle}\n\n${initialContent}`;
        setEditorMarkdown(initialMarkdown);
      }
      
      setCurrentTitle(initialTitle);
    }
  }, [noteId, note]); // Include note to ensure we have the latest data

  // Auto-save effect
  useEffect(() => {
    // Don't save if the initial load isn't complete or if content is null
    if (!isInitialLoadCompleteRef.current || editorMarkdown === null) {
      // If the markdown is loaded, mark initial load as complete
      if (editorMarkdown !== null) {
        isInitialLoadCompleteRef.current = true;
      }
      return;
    }
    
    // Don't save if we are already saving
    if (isSaving) return;
    
    // Set up the debounced save
    const handler = setTimeout(() => {
      handleSave();
    }, 1000); // Save after 1 second of inactivity

    // Cleanup function to clear the timeout if the effect runs again
    return () => {
      clearTimeout(handler);
    };
  }, [editorMarkdown, currentTitle]); // Re-run effect when content or title changes

  // Handle error states
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading note</p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button variant="outline" onClick={() => navigate({ to: '/notes', search: {} })}>
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  // Handle note not found
  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Note not found</p>
          <Button variant="outline" onClick={() => navigate({ to: '/notes', search: {} })}>
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }
  
  // Handle editor content changes
  const handleEditorChange = (newMarkdown: string) => {
    // Update the editor markdown state
    setEditorMarkdown(newMarkdown);
  };
  
  // Handle title changes separately
  const handleTitleChange = (newTitle: string) => {
    setCurrentTitle(newTitle);
  };
  
  // Save the current note
  const handleSave = async () => {
    if (!note || editorMarkdown === null || !isInitialLoadCompleteRef.current || isSaving) return;
    
    try {
      setIsSaving(true);
      
      // Use the full markdown content for saving
      const noteContent = editorMarkdown;
      
      // Save the note - pass the noteId, content, and title separately
      const updatedNote = await saveNote(note.id, noteContent, currentTitle);
      
      // Check if the note ID has changed (due to title change)
      if (updatedNote.id !== note.id) {
        // Navigate to the new note URL
        navigate({ to: '/notes/$noteId', params: { noteId: updatedNote.id } });
      }
      
      toast.success("Note saved successfully", {
        description: "Your changes have been saved to disk"
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note", {
        description: "Please try again or check console for details"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete the current note
  const handleDelete = async () => {
    if (!note) return;
    
    try {
      setIsDeleting(true);
      await deleteNote(note.id);
      toast.success("Note deleted successfully", {
        description: "The note has been permanently removed"
      });
      navigate({ to: '/notes', search: {} });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note", {
        description: "Please try again or check console for details"
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Note actions toolbar */}
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Save button removed */}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-destructive hover:bg-destructive/10"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 h-full w-full">
        <div className={cn(
          "min-h-full",
          isFullscreen ? "p-40 pt-20" : "px-6 pb-20"
        )}>
          {editorMarkdown !== null && note && loadedNoteIdRef.current === noteId ? (
            <NoteEditor 
              key={`note-${noteId}`} // Use prefixed noteId as key to force complete re-render when switching notes
              markdown={editorMarkdown} // Pass combined markdown
              onChange={handleEditorChange} // Pass the content change handler
              onTitleChange={handleTitleChange} // Pass the title change handler
            />
          ) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
