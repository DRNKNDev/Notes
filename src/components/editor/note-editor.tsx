import { 
  MDXEditor, 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin, 
  markdownShortcutPlugin, 
  codeBlockPlugin, 
  linkPlugin, 
  frontmatterPlugin,
  codeMirrorPlugin, 
} from "@mdxeditor/editor"
import { FrontMatterEditor, FrontMatterData } from "./frontmatter-editor";
import { useThemeContext } from "@/components/theme-provider";
import { tailwindCodeMirrorExtensions } from './codemirror-theme';

interface NoteEditorProps {
  frontMatter: FrontMatterData
  markdown: string
  onFrontMatterChange: (data: FrontMatterData) => void
}

export function NoteEditor({
  frontMatter,
  markdown,
  onFrontMatterChange,
}: NoteEditorProps) {
  const { effectiveTheme } = useThemeContext(); // Get current theme
  const isDarkMode = effectiveTheme === 'dark';

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4">
        <FrontMatterEditor
          key={frontMatter.title} // Use title as key to force re-render when frontMatter changes
          frontMatter={frontMatter}
          onChange={onFrontMatterChange}
        />
      </div>
      <MDXEditor
      key={markdown.substring(0, 40)} // Use part of the content as key to force re-render when content changes
      markdown={markdown}
      plugins={
        [
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          codeBlockPlugin(), 
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
          frontmatterPlugin(),
          markdownShortcutPlugin(),
        ] as any
      }
      className={`text-sm w-full ${isDarkMode ? 'mdx-dark-theme' : ''}`}
      contentEditableClassName="prose prose-xs prose-slate dark:prose-invert max-w-none p-0 focus:outline-none text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mt-4 [&_blockquote]:mb-2 [&_pre]:bg-muted/50 [&_pre]:p-2 [&_pre]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:bg-muted/30 [&_code]:p-0.5 [&_code]:rounded [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80 [&_a]:transition-colors"
      />
    </div>
  )
}
