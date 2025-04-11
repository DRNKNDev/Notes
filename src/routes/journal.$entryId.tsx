import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState } from "react";
import { FrontMatterData } from "@/components/editor/frontmatter-editor";
import { ScrollArea } from "@/components/ui/scroll-area";

// This route handles displaying a specific journal entry by its ID
export const Route = createFileRoute('/journal/$entryId')({
  component: JournalEntryView
});

function JournalEntryView() {
  const { entryId } = Route.useParams();
  
  // Sample data for journal entries (this would typically come from a data store)
  const entries = [
    {
      id: "1",
      title: "Today's Journal",
      date: "Today",
      content: "Started working on the new feature. Made good progress with the UI components.",
    },
    {
      id: "2",
      title: "Yesterday's Journal",
      date: "Yesterday",
      content: "Had a productive meeting with the team. Discussed the roadmap for the next quarter.",
    },
    {
      id: "3",
      title: "Weekly Reflection",
      date: "3 days ago",
      content: "This week was challenging but rewarding. Completed the major milestone for the project.",
    },
    {
      id: "4",
      title: "Monthly Review",
      date: "2 weeks ago",
      content: "Looking back at this month's accomplishments. Proud of the team's progress.",
    }
  ];
  
  // Find the entry with the matching ID
  const entry = entries.find(entry => entry.id === entryId);
  
  if (!entry) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Journal entry not found</p>
      </div>
    );
  }
  
  // Create state for frontMatter and handle changes
  const [frontMatter, setFrontMatter] = useState<FrontMatterData>({
    title: entry.title,
    tags: [],
    date: entry.date
  });

  const handleFrontMatterChange = (data: FrontMatterData) => {
    setFrontMatter(data);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-full w-full">
        <div className="p-6 pb-20 min-h-full">
          <NoteEditor 
            frontMatter={frontMatter}
            markdown={entry.content}
            onFrontMatterChange={handleFrontMatterChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
