import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState, useEffect } from "react";
import { FrontMatterData } from "@/components/editor/frontmatter-editor";
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
  const notes = [
    {
      id: "1",
      title: "Welcome to DRNKN Notes!",
      date: "09:34 AM",
      content: markdownContent,
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
  ];
  
  // Find the note with the matching ID
  const note = notes.find(note => note.id === noteId);
  
  if (!note) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Note not found</p>
      </div>
    );
  }
  
  // Create state for frontMatter and handle changes
  const [frontMatter, setFrontMatter] = useState<FrontMatterData>({
    title: note.title,
    tags: [],
    date: note.date
  });
  
  // Reset frontMatter when noteId changes
  useEffect(() => {
    setFrontMatter({
      title: note.title,
      tags: [],
      date: note.date
    });
  }, [noteId, note.title, note.date]);

  const handleFrontMatterChange = (data: FrontMatterData) => {
    setFrontMatter(data);
  };
  
  // Get fullscreen state
  const { isFullscreen } = useFullscreen();

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-full w-full">
        <div className={cn(
          "min-h-full pb-20",
          isFullscreen ? "p-40" : "p-6"
        )}>
          <NoteEditor 
            key={noteId} // Use noteId as key to force complete re-render when switching notes
            frontMatter={frontMatter}
            markdown={note.content}
            onFrontMatterChange={handleFrontMatterChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
