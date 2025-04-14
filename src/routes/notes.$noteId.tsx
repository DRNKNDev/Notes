import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState, useEffect } from "react";
import { FrontMatterData } from "@/components/editor/frontmatter-editor";
import { ScrollArea } from "@/components/ui/scroll-area";

// This route handles displaying a specific note by its ID
export const Route = createFileRoute('/notes/$noteId')({  
  component: NoteView
});

function NoteView() {
  const { noteId } = Route.useParams();
  
  // Sample data for notes (this would typically come from a data store)
  const markdownContent = `This is a quick guide to help you get started with the core features.

## Basic Formatting (Markdown)

DRNKN Notes uses Markdown for formatting. Here are the essentials:

- **Headings:** Use \`#\` symbols (e.g., \`## Subheading\`). More \`#\` means smaller text.
- **Emphasis:** \`*Italic*\` or \`_Italic_\`, \`**Bold**\` or \`__Bold__\`.
- **Lists:**
    - Start lines with \`-\`, \`*\`, or \`+\` for bullets.
    - Use numbers like \`1.\` for ordered lists.
- **Links:** \`[Link Text](https://example.com)\`
- **Images:** \`![Alt Text](image-url.jpg)\`
- **Code:** Use backticks for inline \`code()\`, or triple backticks for blocks:
  \`\`\`javascript
  console.log('Hello, Notes!');
  \`\`\`
- **Blockquotes:** Start lines with \`>\` to quote text.

## Todo Lists with Checkboxes

Create interactive todo lists using square brackets:

- [ ] Plan weekly meeting agenda
- [x] Review project requirements
- [ ] Update documentation
- [x] Send progress report to team
- [ ] Schedule follow-up with design team

## Organizing Your Notes

- Use folders (coming soon!) to group related notes.
- Use descriptive titles for easy searching.
- Leverage headings within notes to structure longer content.

## Tips for Effective Note-Taking

1. **Keep it concise:** Focus on the key information.
2. **Use formatting:** Make your notes scannable and easy to read.
3. **Review regularly:** Revisit your notes to reinforce information.

---

Happy note-taking! Explore the interface and experiment with the features.`;

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

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-full w-full">
        <div className="p-6 pb-20 min-h-full">
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
