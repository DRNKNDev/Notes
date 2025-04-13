import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState, useEffect } from "react";
import { FrontMatterData } from "@/components/editor/frontmatter-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parse, isValid } from "date-fns";

// This route handles displaying a journal entry for a specific date
export const Route = createFileRoute('/journal/$entryId')({  
  component: JournalEntryView
});

function JournalEntryView() {
  const { entryId } = Route.useParams();
  
  // Format the date for display
  const formatJournalDate = (dateString: string) => {
    try {
      // Try to parse the date from the format we expect (yyyy-MM-dd)
      const date = parse(dateString, "yyyy-MM-dd", new Date());
      
      // Check if the date is valid
      if (isValid(date)) {
        // Format as a more readable date
        return format(date, "EEEE, MMMM d, yyyy");
      }
      
      // If not valid, return the original string
      return dateString;
    } catch (error) {
      // If parsing fails, return the original string
      return dateString;
    }
  };
  
  // Get the formatted date for display
  const formattedDate = formatJournalDate(entryId);
  
  // Sample content for a new journal entry
  const defaultContent = `## ${formattedDate}\n\nToday I...\n\n### Highlights\n\n- \n\n### Thoughts\n\n\n### Tomorrow\n\n- `;
  
  // Create state for frontMatter and handle changes
  const [frontMatter, setFrontMatter] = useState<FrontMatterData>({
    title: formattedDate,
    tags: ["journal"],
    date: format(new Date(), "h:mm a")
  });
  
  // Reset frontMatter when entryId changes
  useEffect(() => {
    setFrontMatter({
      title: formattedDate,
      tags: ["journal"],
      date: format(new Date(), "h:mm a")
    });
  }, [entryId, formattedDate]);

  const handleFrontMatterChange = (data: FrontMatterData) => {
    setFrontMatter(data);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-full w-full">
        <div className="p-6 pb-20 min-h-full">
          <NoteEditor 
            key={entryId} // Use entryId as key to force complete re-render when switching entries
            frontMatter={frontMatter}
            markdown={defaultContent}
            onFrontMatterChange={handleFrontMatterChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
