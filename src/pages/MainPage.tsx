import { useState } from "react"
import { NoteEditor } from "@/components/editor/NoteEditor"
import { FrontMatterData } from "@/components/editor/FrontMatterEditor"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MainPage() {
  const [frontMatter, setFrontMatter] = useState<FrontMatterData>({
    title: "Getting Started with DRNKN Notes",
    date: format(new Date(), "yyyy-MM-dd"),
    tags: ["documentation", "guide", "tutorial"],
  })

  const markdown = `DRNKN Notes is a simple, elegant note-taking app designed for developers and technical users. This guide will help you get started with the basic features.

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

Happy note-taking!`

  return (
    <ScrollArea className="h-full">
      <NoteEditor
        frontMatter={frontMatter}
        markdown={markdown}
        onFrontMatterChange={setFrontMatter}
      />
    </ScrollArea>
  )
}
