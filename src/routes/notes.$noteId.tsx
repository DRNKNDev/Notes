import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/lib/notes/notes-store";
import { Note } from "@/lib/notes/types";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Trash } from "lucide-react";
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
  const [editorMarkdown, setEditorMarkdown] = useState<string>('');
  
  // State for the current note title
  const [currentTitle, setCurrentTitle] = useState<string>('');
  
  // Find the note with the matching ID
  const note = notes.find(note => note.id === noteId) as Note | undefined;
  
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
  
  // Initialize editor markdown when noteId changes
  useEffect(() => {
    if (note) {
      // Construct initial editor markdown
      const initialTitle = note.title || 'Untitled';
      
      // Check if bodyContent already starts with a title
      let initialContent = note.bodyContent || '';
      
      // Remove any existing H1 header to prevent duplication
      if (initialContent.trim().startsWith('# ')) {
        // Content already has a header, use it as is
        const initialMarkdown = initialContent;
        console.log('Using existing markdown with header:', initialMarkdown);
        setEditorMarkdown(initialMarkdown);
      } else {
        // Content doesn't have a header, add one
        const initialMarkdown = `# ${initialTitle}\n\n${initialContent}`;
        console.log('Constructed markdown with new header:', initialMarkdown);
        setEditorMarkdown(initialMarkdown);
      }
      
      setCurrentTitle(initialTitle);
    }
  }, [noteId, note]);

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
    if (!note) return;
    
    try {
      setIsSaving(true);
      
      // Use the full markdown content for saving
      const noteContent = editorMarkdown;
      
      // Save the note - pass the noteId, content, and title separately
      await saveNote(note.id, noteContent, currentTitle);
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
  
  // Get fullscreen state
  const { isFullscreen } = useFullscreen();

  return (
    <div className="h-full flex flex-col">
      {/* Note actions toolbar */}
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
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
          <NoteEditor 
            key={noteId} // Use noteId as key to force complete re-render when switching notes
            markdown={editorMarkdown} // Pass combined markdown
            onChange={handleEditorChange} // Pass the content change handler
            onTitleChange={handleTitleChange} // Pass the title change handler
          />
        </div>
      </ScrollArea>
    </div>
  );
}
