import { createFileRoute } from "@tanstack/react-router";
import { NoteEditor } from "@/components/editor/note-editor";
import { useState } from "react";
import { FrontMatterData } from "@/components/editor/frontmatter-editor";
import { ScrollArea } from "@/components/ui/scroll-area";

// This route handles displaying a specific note by its ID
export const Route = createFileRoute('/notes/$noteId')({  
  component: NoteView
});

function NoteView() {
  const { noteId } = Route.useParams();
  
  // Sample data for notes (this would typically come from a data store)
  const markdownContent = `DRNKN Notes is a simple, elegant note-taking app designed for developers and technical users. This guide will help you get started with the basic features.

## Markdown Features

DRNKN Notes supports all standard Markdown syntax, plus some additional features:

### Headings

Use # symbols for headings. More # symbols means a smaller heading.

### Lists

- Create bullet lists with hyphens or asterisks
- Nested lists work too
  - Just indent with two spaces
  - Easy to organize information

1. Numbered lists are also supported
2. Just start with a number and a period

### Code Blocks

Create code blocks with syntax highlighting by using triple backticks and specifying the language:

### Links and Images

- **Links**: Select text and click the link button, or type \`[text](url)\`
- **Images**: Use the image button or type \`![alt text](image-url)\`

### Blockquotes

> Use blockquotes to highlight important information or quotes.
> 
> Start lines with '>' or use the quote button in the toolbar.

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold | Ctrl/⌘ + B |
| Italic | Ctrl/⌘ + I |
| Link | Ctrl/⌘ + K |
| Save | Ctrl/⌘ + S |
| Heading | Ctrl/⌘ + Alt + [1-6] |

## Tips for Productivity

1. **Use keyboard shortcuts** for faster editing
2. **Organize with headings** to create a clear structure
3. **Preview your notes** to see how they'll look when shared
4. **Use code blocks** for technical content with syntax highlighting
5. **Add images** to make your notes more visual and engaging

## Need Help?

If you have any questions or need assistance, click the help icon in the top right corner or visit our documentation at [docs.drnkn.io](https://docs.drnkn.io).

Happy note-taking!`;

  const notes = [
    {
      id: "1",
      title: "Meeting Tomorrow",
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

  const handleFrontMatterChange = (data: FrontMatterData) => {
    setFrontMatter(data);
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 h-full w-full">
        <div className="p-6 pb-20 min-h-full">
          <NoteEditor 
            frontMatter={frontMatter}
            markdown={note.content}
            onFrontMatterChange={handleFrontMatterChange}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
