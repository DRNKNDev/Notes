import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import markdownContent from "@/assets/sample-note.md?raw";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn } from "@/lib/utils";
// This route handles displaying a specific note by its ID
export const Route = createFileRoute('/notes/$noteId')({  
  component: NoteView
});

function NoteView() {
  const { noteId } = Route.useParams();
  
  // Sample data for notes (this would typically come from a data store)
  // Using useState to simulate mutable data source for this example
  const [notes, setNotes] = useState([
    {
      id: "1",
      title: "Welcome to DRNKN Notes!",
      date: "09:34 AM",
      content: markdownContent.split('\n').slice(5).join('\n'), // Get content after frontmatter
    },
    {
      id: "2",
      title: "Project Update",
      date: "Yesterday",
      content: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      id: "3",
      title: "Weekend Plans",
      date: "2 days ago",
      content: "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      id: "4",
      title: "Important Announcement",
      date: "1 week ago",
      content: "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    }
  ]);
  
  // Find the note with the matching ID
  const note = notes.find(note => note.id === noteId);
  
  // State for the combined markdown content in the editor
  const [editorMarkdown, setEditorMarkdown] = useState<string>('');

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Note not found</p>
      </div>
    );
  }
  
  // Initialize editor markdown when noteId changes
  useEffect(() => {
    // Construct initial editor markdown
    const initialTitle = note.title || 'Untitled';
    const initialContent = note.content || '';
    const initialMarkdown = `# ${initialTitle}\n\n${initialContent}`;
    setEditorMarkdown(initialMarkdown);
  }, [noteId, note]);

  // Handle editor content changes
  const handleEditorChange = (newMarkdown: string) => {
    // Update the editor markdown state
    setEditorMarkdown(newMarkdown);
  };
  
  // Handle title changes separately
  const handleTitleChange = (newTitle: string) => {
    // Update the notes data with the new title
    setNotes(prevNotes => 
      prevNotes.map(n => 
        n.id === noteId ? { ...n, title: newTitle } : n
      )
    );
  };
  
  // Get fullscreen state
  const { isFullscreen } = useFullscreen();

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-full w-full">
        <div className={cn(
          "min-h-full",
          isFullscreen ? "p-40 pt-20" : "p-6 pb-20"
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
