import { useState, useEffect, useRef } from "react"

export interface FrontMatterData {
  title: string
  date: string
  tags: string[]
}

export interface FrontMatterEditorProps {
  frontMatter: FrontMatterData
  onChange: (data: FrontMatterData) => void
}

// Custom front-matter component
export function FrontMatterEditor({
  frontMatter,
  onChange,
}: FrontMatterEditorProps) {
  const [title, setTitle] = useState(frontMatter.title || "")
  const [isTitleEditing, setIsTitleEditing] = useState(false)
  
  // Update internal state when props change
  useEffect(() => {
    setTitle(frontMatter.title || "")
  }, [frontMatter.title])

  const titleRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the editing areas to save
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsTitleEditing(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Focus input when editing starts
  useEffect(() => {
    if (isTitleEditing && titleRef.current) {
      titleRef.current.focus()
    }
  }, [isTitleEditing])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    onChange({
      title: e.target.value,
      date: frontMatter.date,
      tags: frontMatter.tags,
    })
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      e.preventDefault()
      setIsTitleEditing(false)
    }
  }

  return (
    <div className="my-4" ref={containerRef}>
      {/* Title section */}
      <div onClick={isTitleEditing ? undefined : () => setIsTitleEditing(true)}>
        {isTitleEditing ? (
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            onBlur={() => setIsTitleEditing(false)}
            className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0"
            placeholder="Title"
          />
        ) : (
          <h1 className="text-2xl font-bold">{title || "Untitled"}</h1>
        )}
      </div>
    </div>
  )
}
