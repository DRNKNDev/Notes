import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin, 
  markdownShortcutPlugin, 
  codeBlockPlugin, 
  linkPlugin, 
  codeMirrorPlugin,
  MDXEditorMethods
} from "@mdxeditor/editor"
import { useThemeContext } from "@/components/theme-provider";
import { tailwindCodeMirrorExtensions } from './codemirror-theme';
import { useRef, useEffect } from 'react';
import { parseMarkdownWithTitle } from '@/hooks/use-markdown-title';

/**
 * Normalizes markdown content to ensure consistent formatting
 * This helps prevent cursor position issues in the MDXEditor
 */
function normalizeMarkdown(content: string | undefined): string {
  if (!content) return '# Default Note\n\nStart writing here...\n';
  
  // Ensure consistent line endings (convert CRLF to LF)
  let normalized = content.replace(/\r\n/g, '\n');
  
  // Ensure content ends with newline
  if (!normalized.endsWith('\n')) {
    normalized += '\n';
  }
  
  // Ensure no consecutive triple newlines (can cause issues)
  normalized = normalized.replace(/\n{3,}/g, '\n\n');
  
  return normalized;
}

interface NoteEditorProps {
  markdown: string
  onChange: (markdown: string) => void
  onTitleChange?: (title: string) => void
}

export function NoteEditor({
  markdown,
  onChange,
  onTitleChange,
}: NoteEditorProps) {
  // Create a ref to access editor methods
  const editorRef = useRef<MDXEditorMethods>(null);
  const { effectiveTheme } = useThemeContext(); // Get current theme
  const isDarkMode = effectiveTheme === 'dark';
  
  // Use a ref to track if we're currently handling an update to prevent circular updates
  const isUpdatingRef = useRef(false);
  
  // Handle markdown changes with title extraction
  const handleMarkdownChange = (newMarkdown: string) => {
    // Prevent circular updates
    if (isUpdatingRef.current) return;
    
    try {
      isUpdatingRef.current = true;
      
      // Parse the markdown to extract title
      const parsed = parseMarkdownWithTitle(newMarkdown);
      
      // Notify parent about title change if callback provided
      if (onTitleChange && parsed.title) {
        onTitleChange(parsed.title);
      }
      
      // Pass the full markdown to parent's onChange handler
      onChange(parsed.fullMarkdown);
    } finally {
      // Always reset the flag when done
      isUpdatingRef.current = false;
    }
  };

  // Use the normalizeMarkdown function to ensure consistent formatting
  const safeMarkdown = normalizeMarkdown(markdown);
  
  // Handle editor errors
  const handleError = (payload: { error: string; source: string }) => {
    console.error('MDXEditor error:', payload.error, 'Source:', payload.source);
    // Prevent the error from crashing the app
    // You could also implement a retry mechanism here
  };
  
  return (
    <div className="flex flex-col w-full">
      <MDXEditor
      ref={editorRef}
      key={safeMarkdown.substring(0, 20)}
      markdown={safeMarkdown}
      onChange={handleMarkdownChange}
      onError={handleError}
      plugins={
        [
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'txt'
          }), 
          codeMirrorPlugin({
            codeBlockLanguages: {
              html: 'HTML',
              css: 'CSS',
              js: 'JavaScript',
              jsx: 'JSX',
              ts: 'TypeScript',
              tsx: 'TSX',
              python: 'Python',
              java: 'Java',
              csharp: 'C#',
              cpp: 'C++',
              php: 'PHP',
              ruby: 'Ruby',
              go: 'Go',
              rust: 'Rust',
              sql: 'SQL',
              bash: 'Bash/Shell',
              json: 'JSON',
              yaml: 'YAML',
              markdown: 'Markdown',
              txt: 'text'
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: tailwindCodeMirrorExtensions, // <-- Use imported extensions
          }),
          linkPlugin(),
          markdownShortcutPlugin(),
        ] as any
      }
      className={`text-sm w-full ${isDarkMode ? 'mdx-dark-theme' : ''}`}
      contentEditableClassName="prose prose-xs prose-slate dark:prose-invert max-w-none p-0 focus:outline-none text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mt-4 [&_blockquote]:mb-2 [&_pre]:bg-muted/50 [&_pre]:p-2 [&_pre]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:bg-muted/30 [&_code]:p-0.5 [&_code]:rounded [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80 [&_a]:transition-colors"
      />
    </div>
  )
}
