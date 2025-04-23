import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

// Define Tailwind colors using Tailwind v4's built-in CSS variables
const twColors = {
  bg: 'var(--background)',
  fg: 'var(--foreground)',
  mutedFg: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  accentFg: 'var(--accent-foreground)',
  border: 'var(--border)',
  selectionBg: 'var(--accent)',
  // Syntax highlighting colors using Tailwind v4 CSS variables
  comment: 'var(--color-slate-400)',
  keyword: 'var(--color-violet-500)',
  string: 'var(--color-emerald-500)',
  number: 'var(--color-orange-500)',
  variableName: 'var(--color-sky-500)',
  className: 'var(--color-pink-500)',
  tag: 'var(--color-indigo-500)',
  attributeName: 'var(--color-teal-500)',
  propertyName: 'var(--color-blue-500)',
  punctuation: 'var(--color-slate-500)',
  operator: 'var(--color-purple-600)',
  invalid: 'var(--color-red-500)',
  lineHighlightBg: 'rgba(128, 128, 128, 0.1)',
  gutterBg: 'var(--background)',
  gutterFg: 'var(--muted-foreground)',
  gutterActiveFg: 'var(--foreground)',
}

// Define the CodeMirror theme using Tailwind colors
const tailwindTheme = EditorView.theme(
  {
    '&': {
      color: twColors.fg,
      backgroundColor: twColors.bg,
      borderColor: twColors.border, // Added border color
      borderRadius: 'var(--radius)', // Use radius variable
    },
    '.cm-content': {
      caretColor: twColors.accent,
      fontFamily: 'var(--font-mono)', // Use mono font variable
      fontSize: '0.75rem', // Add sm font size
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: twColors.accent,
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: twColors.selectionBg + '!important', // Ensure selection style overrides
      },
    '.cm-activeLine': { backgroundColor: twColors.lineHighlightBg },
    '.cm-selectionMatch': { backgroundColor: '#3a3f63' }, // Adjust if needed
    '.cm-gutters': {
      backgroundColor: twColors.gutterBg,
      color: twColors.gutterFg,
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: twColors.lineHighlightBg,
      color: twColors.gutterActiveFg,
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd', // Adjust placeholder color if needed
    },
    '.cm-tooltip': {
      border: `1px solid ${twColors.border}`,
      backgroundColor: twColors.bg,
    },
    '.cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    '.cm-tooltip-arrow:after': {
      borderTopColor: twColors.bg,
      borderBottomColor: twColors.bg,
    },
    '.cm-tooltip.cm-tooltip-autocomplete > ul': {
       fontFamily: 'var(--font-sans)', // Use sans font variable for autocomplete
       whiteSpace: 'nowrap',
       overflow: 'hidden auto',
       maxWidth: '50em', // Adjust as needed
       maxHeight: '10em', // Adjust as needed
       listStyle: 'none',
       margin: 0,
       padding: 0,
       '& > li[aria-selected]': {
         backgroundColor: twColors.lineHighlightBg, // Highlight selected item
         color: twColors.fg, // Ensure text is readable
       }
     }
  },
  { dark: true }, // Assuming a dark theme context, adjust if needed
)

// Define the syntax highlighting style using Tailwind colors
const tailwindHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: twColors.keyword }, // e.g., const, function
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: twColors.variableName,
  },
  { tag: [t.function(t.variableName), t.labelName], color: twColors.variableName }, // Function calls
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)], // CSS Colors, constants
    color: twColors.number, // Or another suitable color
  },
  { tag: [t.definition(t.name), t.separator], color: twColors.fg }, // Variable definitions
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: twColors.className, // Class names, types, numbers
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: twColors.operator, // Operators, URLs
  },
  { tag: [t.meta, t.comment], color: twColors.comment }, // Comments, meta
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: twColors.mutedFg, textDecoration: 'underline' }, // Links
  { tag: t.heading, fontWeight: 'bold', color: twColors.keyword }, // Headings
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: twColors.number, // Booleans, atoms
  },
  {
    tag: [t.processingInstruction, t.string, t.inserted],
    color: twColors.string, // Strings
  },
  { tag: t.invalid, color: twColors.invalid }, // Invalid code
  // HTML/XML specific
  { tag: t.angleBracket, color: twColors.punctuation }, // < >
  { tag: t.tagName, color: twColors.tag }, // HTML tags like div, p
  { tag: t.attributeName, color: twColors.attributeName }, // HTML attributes like class, id
])

// Combine theme and syntax highlighting
export const tailwindCodeMirrorExtensions = [
  tailwindTheme,
  syntaxHighlighting(tailwindHighlightStyle),
]
