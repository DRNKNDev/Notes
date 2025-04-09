import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  linkPlugin,
  imagePlugin,
  frontmatterPlugin,
} from "@mdxeditor/editor"
import { FrontMatterData, FrontMatterEditor } from "./FrontMatterEditor"

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
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4">
        <FrontMatterEditor
          frontMatter={frontMatter}
          onChange={onFrontMatterChange}
        />
      </div>
      <MDXEditor
      markdown={markdown}
      plugins={
        [
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
          linkPlugin(),
          imagePlugin(),
          frontmatterPlugin(),
        ] as any
      }
      className="text-sm"
      contentEditableClassName="prose prose-xs prose-slate dark:prose-invert max-w-none p-0 focus:outline-none h-full text-sm [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mt-4 [&_blockquote]:mb-2 [&_pre]:bg-muted/50 [&_pre]:p-2 [&_pre]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:bg-muted/30 [&_code]:p-0.5 [&_code]:rounded"
      />
    </div>
  )
}
